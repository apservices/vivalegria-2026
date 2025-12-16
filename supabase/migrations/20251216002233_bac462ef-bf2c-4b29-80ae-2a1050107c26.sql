-- Email Templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contract Templates table
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  body_html TEXT NOT NULL,
  footer_html TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin action logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  detalhes JSONB DEFAULT '{}',
  usuario_admin UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add payment tracking to evento_casting
ALTER TABLE public.evento_casting 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pago_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS observacoes_pagamento TEXT;

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_templates
CREATE POLICY "Admins can view all email templates" ON public.email_templates
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email templates" ON public.email_templates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update email templates" ON public.email_templates
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete email templates" ON public.email_templates
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for contract_templates
CREATE POLICY "Admins can view all contract templates" ON public.contract_templates
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert contract templates" ON public.contract_templates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contract templates" ON public.contract_templates
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contract templates" ON public.contract_templates
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for admin_logs
CREATE POLICY "Admins can view all logs" ON public.admin_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert logs" ON public.admin_logs
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default templates
INSERT INTO public.email_templates (tipo, nome, subject, body) VALUES
('contrato_reserva', 'E-mail de Envio de Contrato', 'Seu contrato Vivalegria - Reserva {{codigo}}', 
'Olá {{nome_cliente}}!

Seja bem-vindo ao mundo da alegria! Sou o Alegrito, e estou aqui para garantir momentos mágicos no seu evento.

Segue em anexo o contrato da sua reserva:

📅 Data do Evento: {{data_evento}}
⏰ Horário: {{hora_inicio}}
📍 Local: {{local_evento}}
🎉 Pacote: {{pacote_tipo}}
💰 Valor Total: R$ {{valor_total}}

Por favor, leia atentamente e entre em contato conosco caso tenha alguma dúvida.

Mal podemos esperar para fazer parte desse momento especial!

Com carinho,
Equipe Vivalegria Recreação e Entretenimento

📱 WhatsApp: (11) 96598-2251
📧 contato@vivalegria.com.br
🌐 www.vivalegria.com.br')
ON CONFLICT (tipo) DO NOTHING;

INSERT INTO public.contract_templates (tipo, nome, body_html, footer_html) VALUES
('contrato_evento_infantil', 'Contrato de Evento Infantil', 
'<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #FF731D; margin-bottom: 5px;">VIVALEGRIA</h1>
    <p style="color: #666; font-size: 14px;">Recreação e Entretenimento</p>
  </div>
  
  <h2 style="text-align: center; color: #333; border-bottom: 2px solid #FF731D; padding-bottom: 10px;">
    CONTRATO DE PRESTAÇÃO DE SERVIÇOS
  </h2>
  
  <p style="text-align: center; color: #666; margin-bottom: 30px;">
    Código: <strong>{{codigo}}</strong>
  </p>
  
  <h3 style="color: #FF731D;">1. PARTES</h3>
  <p><strong>CONTRATANTE:</strong> {{nome_cliente}}</p>
  <p><strong>CPF/CNPJ:</strong> {{cpf_cnpj}}</p>
  <p><strong>Telefone:</strong> {{telefone}}</p>
  <p><strong>E-mail:</strong> {{email}}</p>
  
  <p style="margin-top: 20px;"><strong>CONTRATADA:</strong> Vivalegria Recreação e Entretenimento</p>
  <p><strong>CNPJ:</strong> XX.XXX.XXX/0001-XX</p>
  
  <h3 style="color: #FF731D; margin-top: 30px;">2. OBJETO DO CONTRATO</h3>
  <p>Prestação de serviços de recreação infantil conforme especificações abaixo:</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background: #FFF5E6;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Data do Evento</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{data_evento}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Horário de Início</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{hora_inicio}}</td>
    </tr>
    <tr style="background: #FFF5E6;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Local do Evento</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{local_evento}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Endereço Completo</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{endereco_completo}}</td>
    </tr>
    <tr style="background: #FFF5E6;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pacote Contratado</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{pacote_tipo}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Número de Crianças</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{numero_criancas}}</td>
    </tr>
    <tr style="background: #FFF5E6;">
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Oficinas Selecionadas</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{oficinas}}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Extras</strong></td>
      <td style="padding: 10px; border: 1px solid #ddd;">{{extras}}</td>
    </tr>
  </table>
  
  <h3 style="color: #FF731D;">3. VALOR E FORMA DE PAGAMENTO</h3>
  <p><strong>Valor Total:</strong> R$ {{valor_total}}</p>
  <p>Pagamento conforme condições acordadas: 50% de entrada via PIX e 50% até 7 dias antes do evento.</p>
  
  <h3 style="color: #FF731D;">4. TERMOS E CONDIÇÕES</h3>
  <p>Este contrato está sujeito aos Termos e Condições disponíveis em: <a href="https://www.vivalegria.com.br/termos-e-condicoes">www.vivalegria.com.br/termos-e-condicoes</a></p>
  
  <h3 style="color: #FF731D;">5. ACEITE</h3>
  <p>Ao prosseguir com o pagamento, o CONTRATANTE declara ter lido e concordado com todos os termos deste contrato.</p>
  
  <div style="margin-top: 50px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #333; padding-top: 10px;">
        <p><strong>CONTRATANTE</strong></p>
        <p>{{nome_cliente}}</p>
      </div>
    </div>
    <div style="text-align: center; width: 45%;">
      <div style="border-top: 1px solid #333; padding-top: 10px;">
        <p><strong>CONTRATADA</strong></p>
        <p>Vivalegria Recreação e Entretenimento</p>
      </div>
    </div>
  </div>
</div>',
'<div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
  <p>Vivalegria Recreação e Entretenimento</p>
  <p>WhatsApp: (11) 96598-2251 | contato@vivalegria.com.br</p>
  <p>www.vivalegria.com.br</p>
  <p>Gerado em: {{data_geracao}}</p>
</div>')
ON CONFLICT (tipo) DO NOTHING;