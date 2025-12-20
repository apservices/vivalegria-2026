import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET");
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

    const { reserva_id, success_url, cancel_url } = await req.json();

    if (!reserva_id) {
      throw new Error("reserva_id is required");
    }

    console.log(`[create-checkout-session] Processing reserva: ${reserva_id}`);

    // Fetch reservation details
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reserva_id)
      .single();

    if (fetchError || !reserva) {
      console.error("[create-checkout-session] Reserva not found:", fetchError);
      throw new Error("Reserva não encontrada");
    }

    console.log(`[create-checkout-session] Reserva found: ${reserva.codigo}, total: ${reserva.total_calculado}`);

    // Build line items description
    const pacoteLabel = reserva.pacote_tipo === "select" ? "Pacote Select" : "Pacote Clássico";
    const oficinasCount = reserva.oficinas_selecionadas?.length || 0;
    const extrasCount = reserva.extras_selecionados?.length || 0;

    let description = `${pacoteLabel} - ${reserva.numero_criancas} crianças`;
    if (oficinasCount > 0) {
      description += ` + ${oficinasCount} oficina(s)`;
    }
    if (extrasCount > 0) {
      description += ` + ${extrasCount} extra(s)`;
    }

    // Format date for display
    const dataEvento = new Date(reserva.data_evento);
    const dataFormatada = dataEvento.toLocaleDateString("pt-BR");

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Vivalegria - Evento ${dataFormatada}`,
              description: description,
              metadata: {
                reserva_id: reserva_id,
                codigo: reserva.codigo || "",
              },
            },
            unit_amount: Math.round(reserva.total_calculado * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: success_url || `${req.headers.get("origin")}/obrigado?session_id={CHECKOUT_SESSION_ID}&reserva_id=${reserva_id}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/contratar?cancelled=true`,
      customer_email: reserva.email,
      metadata: {
        reserva_id: reserva_id,
        codigo: reserva.codigo || "",
      },
      expires_at: Math.floor(Date.now() / 1000) + 72 * 60 * 60, // 72 hours
      locale: "pt-BR",
    });

    console.log(`[create-checkout-session] Session created: ${session.id}`);

    // Update reserva with payment info
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours from now

    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        payment_link: session.url,
        payment_session_id: session.id,
        payment_expires_at: expiresAt.toISOString(),
        payment_status: "pendente",
        status_venda: "pre_reserva",
      })
      .eq("id", reserva_id);

    if (updateError) {
      console.error("[create-checkout-session] Update error:", updateError);
      // Don't throw - session was created successfully
    }

    console.log(`[create-checkout-session] Reserva updated with payment link`);

    return new Response(
      JSON.stringify({
        success: true,
        session_id: session.id,
        payment_url: session.url,
        expires_at: expiresAt.toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[create-checkout-session] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
