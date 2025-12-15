/**
 * VIVALEGRIA CONTRACT PDF GENERATION
 * 
 * Production-ready contract generation system.
 * VERSION 1.0 - Foundation Layer
 * 
 * Features:
 * - PDF generation using jsPDF (Deno-compatible)
 * - Duplicate prevention (checks if contract already exists)
 * - Dynamic field mapping from reservation data
 * - Company signature placeholder
 * - Audit trail (generated_at, status)
 * 
 * EXTENDING THIS SYSTEM:
 * - Add digital signature: Use DocuSign/HelloSign API integration
 * - Add custom templates: Create separate template files
 * - Add PDF storage: Upload to Supabase Storage bucket
 * - Add versioning: Track contract versions with revision history
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ContractRequest {
  reserva_id: string;
  force_regenerate?: boolean; // Optional: force regeneration even if exists
}

interface ReservaData {
  id: string;
  codigo: string;
  nome_completo: string;
  cpf_cnpj: string;
  tipo_cadastro: "pf" | "pj";
  telefone: string;
  email: string;
  data_evento: string;
  hora_inicio: string;
  local_evento: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  pacote_tipo: string;
  numero_criancas: number;
  total_calculado: number;
  oficinas_selecionadas?: string[];
  extras_selecionados?: string[];
  contrato_gerado_em?: string;
  contrato_url?: string;
  status: string;
}

interface ContractResult {
  success: boolean;
  message: string;
  codigo?: string;
  contract_url?: string;
  generated_at?: string;
  was_duplicate?: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format date for display in contract
 * Example: "sábado, 15 de março de 2025"
 */
const formatDateLong = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date short for filename
 * Example: "15/03/2025"
 */
const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
};

/**
 * Format currency in BRL
 * Example: "R$ 1.590,00"
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Generate safe filename from reservation data
 */
const generateFileName = (reserva: ReservaData): string => {
  const sanitizedName = reserva.nome_completo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-zA-Z0-9]/g, "-")
    .substring(0, 30);
  
  const eventDate = reserva.data_evento.replace(/-/g, "");
  return `Vivalegria-Contrato-${reserva.codigo}-${sanitizedName}-${eventDate}.pdf`;
};

// ============================================
// CONTRACT DATA MAPPING
// ============================================

/**
 * Map reservation data to contract fields
 * This centralizes all field mapping for easy maintenance
 */
const mapContractData = (reserva: ReservaData) => {
  const isClassic = reserva.pacote_tipo?.toLowerCase() === "classic" || 
                    reserva.pacote_tipo?.toLowerCase() === "clássico";
  
  return {
    // Company Info (CONTRATADA)
    company: {
      name: "VIVALEGRIA RECREAÇÃO E ENTRETENIMENTO LTDA",
      cnpj: "XX.XXX.XXX/0001-XX", // PLACEHOLDER: Add real CNPJ
      address: "São Paulo, SP",
      phone: "(11) 96598-2251",
      email: "contato@vivalegria.com.br",
      website: "www.vivalegria.com.br",
    },
    
    // Client Info (CONTRATANTE)
    client: {
      name: reserva.nome_completo,
      document: reserva.cpf_cnpj,
      documentType: reserva.tipo_cadastro === "pf" ? "CPF" : "CNPJ",
      phone: reserva.telefone,
      email: reserva.email,
    },
    
    // Event Info
    event: {
      code: reserva.codigo,
      date: formatDateLong(reserva.data_evento),
      dateShort: formatDateShort(reserva.data_evento),
      time: reserva.hora_inicio,
      duration: "4 horas",
      location: reserva.local_evento,
      address: [reserva.endereco, reserva.cidade, reserva.cep]
        .filter(Boolean)
        .join(", ") || reserva.local_evento,
      childrenCount: reserva.numero_criancas,
    },
    
    // Services
    services: {
      packageName: isClassic ? "Clássico" : "Select",
      packageType: reserva.pacote_tipo,
      recreatorsCount: isClassic ? 1 : 2,
      workshops: reserva.oficinas_selecionadas?.length 
        ? reserva.oficinas_selecionadas.join(", ") 
        : "Pacote base (sem oficinas adicionais)",
      extras: reserva.extras_selecionados?.length 
        ? reserva.extras_selecionados.join(", ") 
        : "Nenhum extra selecionado",
    },
    
    // Financial
    financial: {
      totalValue: formatCurrency(reserva.total_calculado),
      totalValueRaw: reserva.total_calculado,
    },
    
    // Metadata
    meta: {
      generatedAt: new Date().toISOString(),
      generatedAtFormatted: new Date().toLocaleDateString("pt-BR") + " às " + 
                           new Date().toLocaleTimeString("pt-BR"),
      termsUrl: "https://www.vivalegria.com.br/termos-e-condicoes",
    },
  };
};

// ============================================
// PDF GENERATION
// ============================================

/**
 * Generate contract PDF using jsPDF
 * 
 * Returns base64-encoded PDF content
 * 
 * EXTENDING:
 * - Add company logo: doc.addImage(logoBase64, "PNG", x, y, w, h)
 * - Add digital signature: Integrate with signing API
 * - Add watermark: doc.setGState(new doc.GState({opacity: 0.1}))
 */
const generateContractPDF = (reserva: ReservaData): string => {
  const data = mapContractData(reserva);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors (Vivalegria brand)
  const orange = "#FF731D";
  const yellow = "#FFD836";
  const darkGray = "#333333";
  const lightGray = "#666666";

  let y = 20; // Current Y position

  // ---- HEADER ----
  doc.setFontSize(24);
  doc.setTextColor(orange);
  doc.text("VIVALEGRIA", 105, y, { align: "center" });
  
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(lightGray);
  doc.text("Recreação e Entretenimento Infantil", 105, y, { align: "center" });

  // Contract code badge
  y += 10;
  doc.setFillColor(orange);
  doc.roundedRect(75, y - 5, 60, 10, 3, 3, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.text(data.event.code, 105, y + 1, { align: "center" });

  // ---- TITLE ----
  y += 18;
  doc.setFontSize(16);
  doc.setTextColor(darkGray);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", 105, y, { align: "center" });

  // ---- SECTION: CONTRATANTE ----
  y += 15;
  doc.setFillColor(orange);
  doc.rect(15, y - 5, 180, 8, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.text("DADOS DO CONTRATANTE", 20, y);

  y += 12;
  doc.setTextColor(darkGray);
  doc.setFontSize(10);
  
  const clientInfo = [
    ["Nome Completo:", data.client.name],
    [`${data.client.documentType}:`, data.client.document],
    ["Telefone:", data.client.phone],
    ["E-mail:", data.client.email],
  ];

  clientInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", 55, y);
    y += 6;
  });

  // ---- SECTION: EVENTO ----
  y += 8;
  doc.setFillColor(orange);
  doc.rect(15, y - 5, 180, 8, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.text("DADOS DO EVENTO", 20, y);

  y += 12;
  doc.setTextColor(darkGray);
  doc.setFontSize(10);
  
  const eventInfo = [
    ["Data:", data.event.date],
    ["Horário:", data.event.time],
    ["Duração:", data.event.duration],
    ["Local:", data.event.location],
    ["Endereço:", data.event.address],
    ["Crianças:", `${data.event.childrenCount} crianças`],
  ];

  eventInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    
    // Handle long text wrapping
    const maxWidth = 130;
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, 55, y);
    y += 6 * lines.length;
  });

  // ---- SECTION: SERVIÇOS ----
  y += 8;
  doc.setFillColor(orange);
  doc.rect(15, y - 5, 180, 8, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.text("SERVIÇOS CONTRATADOS", 20, y);

  y += 12;
  doc.setTextColor(darkGray);
  doc.setFontSize(10);
  
  const servicesInfo = [
    ["Pacote:", `Pacote ${data.services.packageName}`],
    ["Recreadores:", `${data.services.recreatorsCount} profissional(is)`],
    ["Oficinas:", data.services.workshops],
    ["Extras:", data.services.extras],
  ];

  servicesInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    
    const maxWidth = 130;
    const lines = doc.splitTextToSize(value || "-", maxWidth);
    doc.text(lines, 55, y);
    y += 6 * lines.length;
  });

  // ---- TOTAL VALUE BOX ----
  y += 10;
  doc.setFillColor(yellow);
  doc.roundedRect(15, y - 2, 180, 20, 3, 3, "F");
  doc.setTextColor(darkGray);
  doc.setFontSize(12);
  doc.text("VALOR TOTAL DO CONTRATO", 105, y + 5, { align: "center" });
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(data.financial.totalValue, 105, y + 14, { align: "center" });

  // ---- LEGAL CLAUSES ----
  y += 30;
  doc.setFillColor(orange);
  doc.rect(15, y - 5, 180, 8, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TERMOS E CONDIÇÕES", 20, y);

  y += 12;
  doc.setTextColor(lightGray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // PLACEHOLDER: Legal clauses - expand as needed
  const legalClauses = [
    "Este contrato está sujeito aos Termos e Condições Gerais disponíveis em:",
    data.meta.termsUrl,
    "",
    "Ao confirmar esta contratação, o CONTRATANTE declara estar ciente e de acordo com:",
    "• Políticas de cancelamento e reagendamento",
    "• Condições de pagamento (50% na reserva, 50% até 7 dias antes)",
    "• Responsabilidades das partes conforme termos completos",
    "",
    "A CONTRATADA compromete-se a prestar os serviços com profissionalismo,",
    "segurança e qualidade, conforme especificações deste contrato.",
  ];

  legalClauses.forEach((line) => {
    doc.text(line, 20, y);
    y += 5;
  });

  // ---- SIGNATURES ----
  y += 15;
  
  // Left: Client signature
  doc.setDrawColor(darkGray);
  doc.line(20, y + 15, 90, y + 15);
  doc.setFontSize(9);
  doc.setTextColor(darkGray);
  doc.text("CONTRATANTE", 55, y + 20, { align: "center" });
  doc.setFontSize(8);
  doc.text(data.client.name, 55, y + 25, { align: "center" });

  // Right: Company signature (PLACEHOLDER for image)
  doc.line(110, y + 15, 190, y + 15);
  doc.setFontSize(9);
  doc.text("CONTRATADA", 150, y + 20, { align: "center" });
  doc.setFontSize(8);
  doc.text("Vivalegria Recreação e Entretenimento", 150, y + 25, { align: "center" });
  
  // EXTENDING: Add signature image
  // const signatureBase64 = "data:image/png;base64,..."
  // doc.addImage(signatureBase64, "PNG", 130, y, 40, 15);

  // ---- FOOTER ----
  doc.setFontSize(8);
  doc.setTextColor(lightGray);
  doc.text(
    `Contrato gerado em ${data.meta.generatedAtFormatted}`,
    105, 280, { align: "center" }
  );
  doc.text(
    `${data.company.name} | ${data.company.phone} | ${data.company.email}`,
    105, 285, { align: "center" }
  );

  // Return base64-encoded PDF
  return doc.output("datauristring").split(",")[1];
};

// ============================================
// EMAIL HTML TEMPLATE
// ============================================

const generateEmailHTML = (reserva: ReservaData): string => {
  const data = mapContractData(reserva);

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
        <p style="margin: 0; opacity: 0.9;">Código: <strong>${data.event.code}</strong></p>
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
              ${data.client.name}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">📅 Data:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${data.event.dateShort}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">⏰ Horário:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              ${data.event.time}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">📦 Pacote:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              Pacote ${data.services.packageName}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #666;">💰 Valor:</strong>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
              <strong>${data.financial.totalValue}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #666;">🎨 Serviços:</strong>
            </td>
            <td style="padding: 8px 0; text-align: right;">
              ${data.services.workshops}
            </td>
          </tr>
        </table>
      </div>

      <!-- Contract Notice -->
      <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px 20px; border-radius: 0 10px 10px 0; margin-bottom: 25px;">
        <p style="margin: 0; color: #1565C0;">
          📎 <strong>Anexo:</strong> Seu contrato em PDF está anexo a este e-mail.
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
        ${data.company.name}<br>
        ${data.company.address} | ${data.company.email}
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// ============================================
// MAIN HANDLER
// ============================================

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
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
    const { reserva_id, force_regenerate = false }: ContractRequest = await req.json();

    if (!reserva_id) {
      throw new Error("reserva_id is required");
    }

    console.log("[Contract] Starting generation for reserva:", reserva_id);

    // ---- FETCH RESERVATION ----
    const { data: reserva, error: fetchError } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reserva_id)
      .single();

    if (fetchError || !reserva) {
      throw new Error("Reserva not found: " + fetchError?.message);
    }

    console.log("[Contract] Reserva found:", reserva.codigo);

    // ---- DUPLICATE PREVENTION ----
    // Check if contract already exists and skip if not forcing regeneration
    if (reserva.contrato_gerado_em && !force_regenerate) {
      console.log("[Contract] Contract already exists, skipping generation");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Contrato já existe para esta reserva",
          codigo: reserva.codigo,
          contract_url: reserva.contrato_url,
          generated_at: reserva.contrato_gerado_em,
          was_duplicate: true,
        } as ContractResult),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ---- GENERATE PDF ----
    console.log("[Contract] Generating PDF...");
    const pdfBase64 = generateContractPDF(reserva as ReservaData);
    const fileName = generateFileName(reserva as ReservaData);

    console.log("[Contract] PDF generated, filename:", fileName);

    // ---- SEND EMAIL ----
    console.log("[Contract] Sending email to:", reserva.email);
    
    const emailHTML = generateEmailHTML(reserva as ReservaData);
    
    const emailPayload = {
      from: "Vivalegria <contato@vivalegria.com.br>",
      to: [reserva.email],
      subject: `Contratação Vivalegria – Evento confirmado 🎉 [${reserva.codigo}]`,
      html: emailHTML,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
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
      console.error("[Contract] Email send error:", emailResponse);
      throw new Error(`Failed to send email: ${emailResponse.message || "Unknown error"}`);
    }

    console.log("[Contract] Email sent successfully:", emailResponse);

    // ---- UPDATE RESERVATION ----
    const now = new Date().toISOString();
    const contractUrl = `contract://${reserva.codigo}/${fileName}`;
    
    const { error: updateError } = await supabase
      .from("reservas")
      .update({
        status: "aprovado",
        contrato_url: contractUrl,
        contrato_gerado_em: now,
        email_enviado_em: now,
      })
      .eq("id", reserva_id);

    if (updateError) {
      console.error("[Contract] Error updating reserva:", updateError);
      // Don't throw - email was sent successfully
    }

    console.log("[Contract] Generation complete for:", reserva.codigo);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contrato PDF gerado e enviado com sucesso",
        codigo: reserva.codigo,
        contract_url: contractUrl,
        generated_at: now,
        was_duplicate: false,
      } as ContractResult),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Contract] Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
