import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("[stripe-webhook] Signature verification failed:", errMessage);
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      // For development/testing without signature verification
      event = JSON.parse(body);
      console.log("[stripe-webhook] Warning: Processing without signature verification");
    }

    console.log(`[stripe-webhook] Event received: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservaId = session.metadata?.reserva_id;

        if (!reservaId) {
          console.error("[stripe-webhook] No reserva_id in session metadata");
          break;
        }

        console.log(`[stripe-webhook] Payment completed for reserva: ${reservaId}`);

        // Determine payment method
        let paymentMethod = "card";
        if (session.payment_method_types?.includes("pix")) {
          paymentMethod = "pix";
        }

        // Update reserva with payment confirmation
        const { error: updateError } = await supabase
          .from("reservas")
          .update({
            payment_status: "pago",
            payment_completed_at: new Date().toISOString(),
            payment_method: paymentMethod,
            status_venda: "confirmado",
            status: "confirmada",
          })
          .eq("id", reservaId);

        if (updateError) {
          console.error("[stripe-webhook] Update error:", updateError);
        } else {
          console.log(`[stripe-webhook] Reserva ${reservaId} marked as paid`);
        }

        // Log admin action
        const { error: logError } = await supabase.from("admin_logs").insert({
          acao: "PAGAMENTO_CONFIRMADO",
          reserva_id: reservaId,
          detalhes: {
            stripe_session_id: session.id,
            amount: session.amount_total,
            currency: session.currency,
            payment_method: paymentMethod,
            customer_email: session.customer_email,
          },
          descricao: `Pagamento confirmado via Stripe - ${(session.amount_total || 0) / 100} BRL`,
        });

        if (logError) {
          console.error("[stripe-webhook] Log error:", logError);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservaId = session.metadata?.reserva_id;

        if (!reservaId) {
          console.error("[stripe-webhook] No reserva_id in session metadata");
          break;
        }

        console.log(`[stripe-webhook] Session expired for reserva: ${reservaId}`);

        // Update reserva with expired status
        const { error: updateError } = await supabase
          .from("reservas")
          .update({
            payment_status: "expirado",
            payment_link: null, // Clear expired link
          })
          .eq("id", reservaId);

        if (updateError) {
          console.error("[stripe-webhook] Update error:", updateError);
        } else {
          console.log(`[stripe-webhook] Reserva ${reservaId} marked as expired`);
        }

        // Log admin action
        await supabase.from("admin_logs").insert({
          acao: "PAGAMENTO_EXPIRADO",
          reserva_id: reservaId,
          detalhes: {
            stripe_session_id: session.id,
          },
          descricao: "Link de pagamento expirado",
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[stripe-webhook] Payment failed: ${paymentIntent.id}`);
        
        // Log failure for analysis
        await supabase.from("admin_logs").insert({
          acao: "PAGAMENTO_FALHOU",
          detalhes: {
            payment_intent_id: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
          },
          descricao: `Falha no pagamento: ${paymentIntent.last_payment_error?.message || "Erro desconhecido"}`,
        });

        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[stripe-webhook] Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
