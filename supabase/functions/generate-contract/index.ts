import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContractRequest {
  reserva_id: string;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const generateContractHTML = (reserva: any): string => {
  const isClassic = reserva.pacote_tipo?.toLowerCase() === "classic" || reserva.pacote_tipo?.toLowerCase() === "clássico";
  const packageName = isClassic ? "Clássico" : "Select";
  const duration = "4 horas";
  const numRecreadores = isClassic ? 1 : 2;

  const oficinas = reserva.oficinas_selecionadas?.length > 0 
    ? reserva.oficinas_selecionadas.join(", ") 
    : "Nenhuma oficina adicional";
  
  const extras = reserva.extras_selecionados?.length > 0 
    ? reserva.extras_selecionados.join(", ") 
    : "Nenhum extra selecionado";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato Vivalegria - ${reserva.codigo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; border-bottom: 3px solid #FFD836; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #FF731D; }
    .logo span { color: #FFD836; }
    .contract-code { background: #FF731D; color: white; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; font-weight: bold; }
    .section { margin-bottom: 25px; }
    .section-title { background: linear-gradient(90deg, #FFD836, #FF731D); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .info-item { padding: 10px; background: #FFF8E6; border-radius: 5px; }
    .info-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 3px; }
    .info-value { font-size: 14px; font-weight: 600; color: #333; }
    .full-width { grid-column: span 2; }
    .highlight-box { background: linear-gradient(135deg, #FFD836 0%, #FF731D 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
    .highlight-box .amount { font-size: 32px; font-weight: bold; }
    .terms { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #FFD836; }
    .signature-area { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 60px; }
    .signature-line { border-top: 1px solid #333; padding-top: 10px; text-align: center; font-size: 12px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Viva<span>legria</span></div>
      <p style="color: #666; margin-top: 5px;">Recreação e Entretenimento Infantil</p>
      <div class="contract-code">${reserva.codigo}</div>
    </div>

    <h2 style="text-align: center; margin-bottom: 30px; color: #FF731D;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>

    <div class="section">
      <div class="section-title">📋 DADOS DO CONTRATANTE</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nome Completo</div>
          <div class="info-value">${reserva.nome_completo}</div>
        </div>
        <div class="info-item">
          <div class="info-label">${reserva.tipo_cadastro === 'pf' ? 'CPF' : 'CNPJ'}</div>
          <div class="info-value">${reserva.cpf_cnpj}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Telefone</div>
          <div class="info-value">${reserva.telefone}</div>
        </div>
        <div class="info-item">
          <div class="info-label">E-mail</div>
          <div class="info-value">${reserva.email}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎉 DADOS DO EVENTO</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Data do Evento</div>
          <div class="info-value">${formatDate(reserva.data_evento)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Horário de Início</div>
          <div class="info-value">${reserva.hora_inicio}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Duração</div>
          <div class="info-value">${duration}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Quantidade de Crianças</div>
          <div class="info-value">${reserva.numero_criancas} crianças</div>
        </div>
        <div class="info-item full-width">
          <div class="info-label">Local do Evento</div>
          <div class="info-value">${reserva.local_evento}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🎁 SERVIÇOS CONTRATADOS</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Pacote</div>
          <div class="info-value">Pacote ${packageName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Recreadores</div>
          <div class="info-value">${numRecreadores} profissional(is)</div>
        </div>
        <div class="info-item full-width">
          <div class="info-label">Oficinas Adicionais</div>
          <div class="info-value">${oficinas}</div>
        </div>
        <div class="info-item full-width">
          <div class="info-label">Extras</div>
          <div class="info-value">${extras}</div>
        </div>
      </div>
    </div>

    <div class="highlight-box">
      <p style="font-size: 14px; margin-bottom: 5px;">VALOR TOTAL DO CONTRATO</p>
      <div class="amount">${formatCurrency(reserva.total_calculado)}</div>
    </div>

    <div class="section">
      <div class="section-title">📝 TERMOS E CONDIÇÕES</div>
      <p style="font-size: 13px; color: #666; text-align: justify;">
        Este contrato está sujeito aos Termos e Condições disponíveis em: 
        <strong>https://www.vivalegria.com.br/termos-e-condicoes</strong>
      </p>
      <p style="font-size: 13px; color: #666; margin-top: 10px; text-align: justify;">
        Ao confirmar esta contratação, o CONTRATANTE declara estar ciente e de acordo com todos os termos, 
        incluindo políticas de cancelamento, reagendamento e condições de pagamento.
      </p>
    </div>

    <div class="signature-area">
      <div>
        <div class="signature-line">
          <strong>CONTRATANTE</strong><br>
          ${reserva.nome_completo}
        </div>
      </div>
      <div>
        <div class="signature-line">
          <strong>CONTRATADA</strong><br>
          Vivalegria Recreação e Entretenimento
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="font-size: 12px; color: #666;">
        Contrato gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}<br>
        Vivalegria Recreação e Entretenimento Infantil<br>
        São Paulo, SP | contato@vivalegria.com.br | (11) 96598-2251
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

const generateEmailHTML = (reserva: any): string => {
  const formatDateSimple = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  const oficinas = reserva.oficinas_selecionadas?.length > 0 
    ? reserva.oficinas_selecionadas.join(", ") 
    : "Pacote base";

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #FFF8E6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #FFD836 0%, #FF731D 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Vivalegria</h1>
      <p style="color: white; margin: 10px 0 0; opacity: 0.9;">Recreação e Entretenimento Infantil</p>
    </div>

    <!-- Mascote Message -->
    <div style="padding: 30px; text-align: center; background: #FFF8E6;">
      <div style="font-size: 60px; margin-bottom: 15px;">🌟</div>
      <h2 style="color: #FF731D; margin: 0 0 15px;">Olá! Seja bem-vindo ao mundo da alegria!</h2>
      <p style="color: #666; font-size: 16px; margin: 0;">
        Sou o <strong style="color: #FF731D;">Alegrito</strong>, e estou aqui para garantir momentos mágicos no seu evento!
      </p>
    </div>

    <!-- Confirmation -->
    <div style="padding: 0 30px 30px;">
      <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 15px; text-align: center; margin-bottom: 25px;">
        <h3 style="margin: 0 0 5px; font-size: 20px;">✅ Evento Confirmado!</h3>
        <p style="margin: 0; opacity: 0.9;">Código: <strong>${reserva.codigo}</strong></p>
      </div>

      <!-- Event Details -->
      <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; margin-bottom: 25px;">
        <h3 style="color: #FF731D; margin: 0 0 15px; font-size: 18px;">📋 Detalhes do seu Evento</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">👤 Contratante:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${reserva.nome_completo}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">📅 Data:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${formatDateSimple(reserva.data_evento)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">⏰ Horário:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${reserva.hora_inicio}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">📦 Pacote:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${reserva.pacote_tipo}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #666;">🎨 Serviços:</strong>
            </td>
            <td style="padding: 8px 0; text-align: right;">
              ${oficinas}
            </td>
          </tr>
        </table>
      </div>

      <!-- Contract Notice -->
      <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px 20px; border-radius: 0 10px 10px 0; margin-bottom: 25px;">
        <p style="margin: 0; color: #1565C0;">
          📎 <strong>Anexo:</strong> Seu contrato completo está em anexo para sua segurança e tranquilidade.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="color: #666; margin-bottom: 15px;">Dúvidas? Fale conosco pelo WhatsApp!</p>
        <a href="https://wa.me/5511965982251" style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold;">
          💬 Falar no WhatsApp
        </a>
      </div>
    </div>

    <!-- Social -->
    <div style="background: #333; padding: 25px; text-align: center;">
      <p style="color: #999; margin: 0 0 15px; font-size: 14px;">Siga-nos nas redes sociais</p>
      <a href="https://instagram.com/vivalegria" style="color: #FFD836; text-decoration: none; margin: 0 10px;">📷 Instagram</a>
      <a href="https://facebook.com/vivalegria" style="color: #FFD836; text-decoration: none; margin: 0 10px;">👍 Facebook</a>
    </div>

    <!-- Footer -->
    <div style="padding: 20px; text-align: center; background: #222;">
      <p style="color: #888; font-size: 12px; margin: 0;">
        Vivalegria Recreação e Entretenimento<br>
        São Paulo, SP | contato@vivalegria.com.br
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { reserva_id }: ContractRequest = await req.json();

    if (!reserva_id) {
      throw new Error("reserva_id is required");
    }

    console.log("Generating contract for reserva:", reserva_id);

    // Fetch reserva
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reserva_id)
      .single();

    if (fetchError || !reserva) {
      throw new Error("Reserva not found: " + fetchError?.message);
    }

    console.log("Reserva found:", reserva.codigo);

    // Generate contract HTML
    const contractHTML = generateContractHTML(reserva);
    
    // Generate email HTML
    const emailHTML = generateEmailHTML(reserva);

    // Format filename
    const sanitizedName = reserva.nome_completo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .substring(0, 30);
    
    const eventDate = reserva.data_evento.replace(/-/g, "");
    const eventTime = reserva.hora_inicio.replace(/:/g, "");
    const fileName = `Vivalegria-Contrato-${reserva.codigo}-${sanitizedName}-${eventDate}-${eventTime}.html`;

    console.log("Sending email to:", reserva.email);

    // Send email with Resend API directly
    const encoder = new TextEncoder();
    const contractBytes = encoder.encode(contractHTML);
    const contractBase64 = base64Encode(contractBytes.buffer);
    
    const emailPayload = {
      from: "Vivalegria <contato@vivalegria.com.br>",
      to: [reserva.email],
      subject: `Contratação Vivalegria – Evento confirmado 🎉 [${reserva.codigo}]`,
      html: emailHTML,
      attachments: [
        {
          filename: fileName,
          content: contractBase64,
        },
      ],
    };

    const emailRes = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const emailResponse = await emailRes.json();
    
    if (!emailRes.ok) {
      console.error("Email send error:", emailResponse);
      throw new Error(`Failed to send email: ${emailResponse.message || "Unknown error"}`);
    }

    console.log("Email sent successfully:", emailResponse);

    // Update reserva with contract info
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        status: "aprovado",
        contrato_url: `contract://${reserva.codigo}`,
        contrato_gerado_em: now,
        email_enviado_em: now,
      })
      .eq("id", reserva_id);

    if (updateError) {
      console.error("Error updating reserva:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contrato gerado e enviado com sucesso",
        codigo: reserva.codigo,
        email_sent_to: reserva.email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-contract:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
