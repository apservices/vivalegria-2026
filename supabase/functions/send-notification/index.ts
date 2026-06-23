/**
 * VIVALEGRIA AUTOMATED EMAIL SYSTEM
 * 
 * Sends automated emails for:
 * - Booking confirmation
 * - Contract delivery
 * - Satisfaction survey request
 * - Recreator event notification
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "confirmacao" | "contrato" | "pesquisa" | "convocacao" | "pagamento";
  reserva_id?: string;
  to_email?: string;
  to_name?: string;
  custom_data?: Record<string, any>;
}

interface EmailResult {
  success: boolean;
  message: string;
  email_id?: string;
}

// Email templates
const getEmailTemplate = (type: string, data: Record<string, any>): { subject: string; html: string } => {
  const templates: Record<string, { subject: string; html: string }> = {
    confirmacao: {
      subject: `🎉 Reserva Confirmada - ${data.codigo || "Vivalegria"}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #FFF8E6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; }
    .logo { font-size: 32px; font-weight: bold; color: #FF731D; }
    .mascot-text { color: #FFD836; font-size: 14px; margin-top: 5px; }
    .card { background: white; border-radius: 16px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .highlight { background: linear-gradient(135deg, #FFD836 0%, #FF731D 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .codigo { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: 600; color: #666; min-width: 140px; }
    .info-value { color: #333; }
    .steps { margin: 20px 0; }
    .step { display: flex; align-items: flex-start; margin: 15px 0; }
    .step-number { background: #FF731D; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
    .footer { text-align: center; padding: 30px 0; color: #666; font-size: 14px; }
    .cta-button { display: inline-block; background: #25D366; color: white !important; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: 600; margin: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎈 VIVALEGRIA</div>
      <div class="mascot-text">Olá! Sou o Alegrito, e estou muito feliz em receber você!</div>
    </div>
    
    <div class="card">
      <h1 style="color: #FF731D; margin: 0 0 20px;">Reserva Confirmada! 🎉</h1>
      
      <p>Olá, <strong>${data.nome || "Cliente"}</strong>!</p>
      <p>Recebemos sua reserva e estamos preparando tudo para garantir momentos mágicos no seu evento!</p>
      
      <div class="highlight">
        <div style="font-size: 12px; opacity: 0.9;">Código da Reserva</div>
        <div class="codigo">${data.codigo || "---"}</div>
      </div>
      
      <h3 style="color: #333; margin: 25px 0 15px;">📋 Dados do Evento</h3>
      
      <div class="info-row">
        <span class="info-label">📅 Data:</span>
        <span class="info-value">${data.data_evento || "-"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">⏰ Horário:</span>
        <span class="info-value">${data.hora_inicio || "-"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">📍 Local:</span>
        <span class="info-value">${data.local_evento || "-"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">🎁 Pacote:</span>
        <span class="info-value">${data.pacote_tipo || "-"}</span>
      </div>
      <div class="info-row">
        <span class="info-label">👶 Crianças:</span>
        <span class="info-value">${data.numero_criancas || "-"}</span>
      </div>
      <div class="info-row" style="border-bottom: none;">
        <span class="info-label">💰 Valor Total:</span>
        <span class="info-value" style="font-weight: bold; color: #FF731D;">${data.valor_total || "-"}</span>
      </div>
      
      <div class="steps">
        <h3 style="color: #333;">📝 Próximos Passos</h3>
        <div class="step">
          <div class="step-number">1</div>
          <div><strong>WhatsApp:</strong> Nossa equipe entrará em contato para confirmar os detalhes.</div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div><strong>Contrato:</strong> Após confirmação, você receberá o contrato por e-mail.</div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div><strong>Pagamento:</strong> 50% na reserva, 50% até 7 dias antes do evento.</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wa.me/5511965982251?text=Olá! Minha reserva é ${data.codigo}. Gostaria de confirmar os detalhes." class="cta-button">
          💬 Falar no WhatsApp
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>💛 Obrigado por escolher a Vivalegria!</p>
      <p>
        <a href="https://instagram.com/vivalegria.recreacao" style="color: #FF731D; text-decoration: none;">Instagram</a> |
        <a href="https://www.vivalegria.com.br" style="color: #FF731D; text-decoration: none;">Site</a>
      </p>
      <p style="font-size: 12px; color: #999;">
        Vivalegria Recreação e Entretenimento<br>
        (11) 96598-2251 | contato@vivalegria.com.br
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
    pesquisa: {
      subject: "💬 Como foi o evento? Queremos saber sua opinião!",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #FFF8E6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; }
    .logo { font-size: 32px; font-weight: bold; color: #FF731D; }
    .card { background: white; border-radius: 16px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .cta-button { display: inline-block; background: #FF731D; color: white !important; padding: 16px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; }
    .footer { text-align: center; padding: 30px 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎈 VIVALEGRIA</div>
    </div>
    
    <div class="card">
      <h1 style="color: #FF731D; margin: 0 0 20px; text-align: center;">Como foi o evento? 💛</h1>
      
      <p>Olá, <strong>${data.nome || "Cliente"}</strong>!</p>
      
      <p>Esperamos que o evento tenha sido incrível! 🎉</p>
      
      <p>Sua opinião é muito importante para nós. Por favor, dedique alguns minutinhos para avaliar nosso serviço.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.pesquisa_url || "#"}" class="cta-button">
          ⭐ Avaliar Agora
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; text-align: center;">
        A pesquisa leva menos de 2 minutos para responder.
      </p>
    </div>
    
    <div class="footer">
      <p>💛 Obrigado por fazer parte da família Vivalegria!</p>
      <p style="font-size: 12px; color: #999;">
        Vivalegria Recreação e Entretenimento<br>
        (11) 96598-2251 | contato@vivalegria.com.br
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
    convocacao: {
      subject: `📅 Novo Evento: ${data.data_evento || ""} - Vivalegria`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #FFF8E6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; }
    .logo { font-size: 32px; font-weight: bold; color: #FF731D; }
    .card { background: white; border-radius: 16px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .info-row { padding: 10px 0; border-bottom: 1px solid #eee; }
    .footer { text-align: center; padding: 30px 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎈 VIVALEGRIA</div>
    </div>
    
    <div class="card">
      <h1 style="color: #FF731D; margin: 0 0 20px;">Você foi escalado! 🎉</h1>
      
      <p>Olá, <strong>${data.recreador_nome || "Recreador"}</strong>!</p>
      
      <p>Você foi escalado para o seguinte evento:</p>
      
      <div style="background: #FFF8E6; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div class="info-row"><strong>📅 Data:</strong> ${data.data_evento || "-"}</div>
        <div class="info-row"><strong>⏰ Horário:</strong> ${data.hora_inicio || "-"}</div>
        <div class="info-row"><strong>📍 Local:</strong> ${data.local_evento || "-"}</div>
        <div class="info-row"><strong>👶 Crianças:</strong> ${data.numero_criancas || "-"}</div>
        <div class="info-row" style="border-bottom: none;"><strong>🎯 Função:</strong> ${data.funcao || "Recreador"}</div>
      </div>
      
      <p>Por favor, confirme sua participação respondendo esta mensagem ou pelo WhatsApp.</p>
    </div>
    
    <div class="footer">
      <p>💛 Contamos com você!</p>
      <p style="font-size: 12px; color: #999;">
        Vivalegria Recreação e Entretenimento<br>
        (11) 96598-2251
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
    pagamento: {
      subject: `💰 Pagamento Confirmado - ${data.codigo || "Vivalegria"}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #FFF8E6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; }
    .logo { font-size: 32px; font-weight: bold; color: #FF731D; }
    .card { background: white; border-radius: 16px; padding: 30px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .footer { text-align: center; padding: 30px 0; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎈 VIVALEGRIA</div>
    </div>
    
    <div class="card">
      <h1 style="color: #25D366; margin: 0 0 20px; text-align: center;">Pagamento Confirmado! ✅</h1>
      
      <p>Olá, <strong>${data.recreador_nome || "Recreador"}</strong>!</p>
      
      <p>Seu pagamento referente ao evento <strong>${data.codigo || "-"}</strong> foi processado com sucesso.</p>
      
      <div style="background: #E8F5E9; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
        <div style="font-size: 14px; color: #666;">Valor</div>
        <div style="font-size: 28px; font-weight: bold; color: #25D366;">${data.valor || "R$ 0,00"}</div>
      </div>
      
      <p style="font-size: 14px; color: #666;">
        Data do pagamento: ${data.data_pagamento || new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
    
    <div class="footer">
      <p>💛 Obrigado pelo seu trabalho!</p>
      <p style="font-size: 12px; color: #999;">
        Vivalegria Recreação e Entretenimento
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
  };

  return templates[type] || templates.confirmacao;
};

// Format date helper
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- AUTH: require authenticated admin ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await authClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const { data: isAdmin } = await authClient.rpc("has_role", {
      _user_id: claimsData.claims.sub, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const request: EmailRequest = await req.json();
    console.log("Email request received:", request.type);

    let emailData: Record<string, any> = { ...request.custom_data };

    // If reserva_id is provided, fetch reservation data
    if (request.reserva_id) {
      const { data: reserva, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("id", request.reserva_id)
        .single();

      if (error || !reserva) {
        console.error("Reserva not found:", error);
        throw new Error("Reserva não encontrada");
      }

      emailData = {
        ...emailData,
        codigo: reserva.codigo,
        nome: reserva.nome_completo,
        email: reserva.email,
        data_evento: formatDate(reserva.data_evento),
        hora_inicio: reserva.hora_inicio,
        local_evento: reserva.local_evento,
        pacote_tipo: reserva.pacote_tipo === "classic" ? "Clássico" : "Select",
        numero_criancas: reserva.numero_criancas,
        valor_total: formatCurrency(reserva.total_calculado),
      };
    }

    // Get email template
    const template = getEmailTemplate(request.type, emailData);

    // Determine recipient
    const toEmail = request.to_email || emailData.email;
    const toName = request.to_name || emailData.nome;

    if (!toEmail) {
      throw new Error("Destinatário não especificado");
    }

    console.log(`Sending ${request.type} email to: ${toEmail}`);

    // Send email via Resend
    const emailResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vivalegria <noreply@vivalegria.com.br>",
        to: [toEmail],
        subject: template.subject,
        html: template.html,
      }),
    });

    const resendResult = await emailResponse.json();
    console.log("Resend response:", resendResult);

    if (!emailResponse.ok) {
      throw new Error(resendResult.message || "Erro ao enviar email");
    }

    // Log email sent in admin_logs if reserva_id exists
    if (request.reserva_id) {
      await supabase.from("admin_logs").insert({
        acao: `EMAIL_${request.type.toUpperCase()}_ENVIADO`,
        reserva_id: request.reserva_id,
        descricao: `Email de ${request.type} enviado para ${toEmail}`,
        payload: { email_id: resendResult.id, to: toEmail },
      });

      // Update reserva with email sent timestamp for confirmacao type
      if (request.type === "confirmacao") {
        await supabase
          .from("reservas")
          .update({ email_enviado_em: new Date().toISOString() })
          .eq("id", request.reserva_id);
      }
    }

    const result: EmailResult = {
      success: true,
      message: `Email de ${request.type} enviado com sucesso`,
      email_id: resendResult.id,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-notification:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Erro interno",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
