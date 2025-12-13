import { CheckCircle2, Phone, Mail } from "lucide-react";
import SEO from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const Termos = () => {
  const sections = [
    {
      title: "Introdução",
      content: [
        "Bem-vindo aos Termos e Condições da Vivalegria Recreação. Ao contratar nossos serviços, você declara que leu, compreendeu e concorda com todas as condições descritas neste documento.",
        "Estes termos aplicam-se a todos os serviços prestados pela Vivalegria, incluindo recreação infantil, oficinas criativas, eventos corporativos e demais atividades oferecidas.",
        "Reservamo-nos o direito de atualizar estes termos a qualquer momento, sendo de responsabilidade do cliente verificar periodicamente eventuais alterações.",
      ],
    },
    {
      title: "Reservas e Pagamentos",
      content: [
        "<strong>50% no ato da reserva:</strong> Para garantir sua data, é necessário realizar o pagamento de 50% do valor total do serviço contratado.",
        "<strong>50% até 24 horas antes do evento:</strong> O saldo restante deve ser quitado com no mínimo 24 horas de antecedência.",
        "<strong>Formas de pagamento:</strong> Aceitamos PIX, transferência bancária, cartão de crédito (com acréscimo de taxa) e dinheiro.",
        "<strong>Importante:</strong> A falta de pagamento no prazo estipulado inviabiliza a realização do evento.",
        "<strong>Inadimplência:</strong> Em caso de não pagamento após a prestação do serviço, reservamo-nos o direito de realizar cobrança judicial e negativação do CPF/CNPJ junto aos órgãos de proteção ao crédito.",
      ],
    },
    {
      title: "Cancelamento e Reagendamento",
      content: [
        "<strong>Cancelamento com 7 dias ou mais de antecedência:</strong> Multa de 50% do valor total contratado.",
        "<strong>Cancelamento com menos de 7 dias de antecedência:</strong> Multa de 80% do valor total contratado.",
        "<strong>Reagendamento:</strong> Solicitações de reagendamento devem ser feitas com no mínimo 7 dias de antecedência e estão sujeitas à disponibilidade de data. Cada contrato permite apenas um reagendamento sem custos adicionais.",
        "Os valores pagos após aplicação da multa serão devolvidos em até 15 dias úteis.",
        "Casos excepcionais (doenças graves, emergências) serão analisados individualmente pela equipe Vivalegria.",
      ],
    },
    {
      title: "Serviços Prestados",
      content: [
        "<strong>Equipe qualificada:</strong> Nossos recreadores são treinados e capacitados para atender crianças de diferentes faixas etárias com segurança e profissionalismo.",
        "<strong>Materiais inclusos:</strong> Todos os materiais necessários para as atividades contratadas são fornecidos pela Vivalegria, exceto quando especificado em contrário.",
        "<strong>Responsabilidade do espaço:</strong> O contratante é responsável por garantir um espaço adequado e seguro para a realização das atividades.",
        "<strong>Custos adicionais:</strong> Deslocamentos para locais fora da área de cobertura padrão (Grande São Paulo) podem ter custos adicionais de transporte.",
        "<strong>Horários:</strong> Nossa equipe chegará com 30 minutos de antecedência para preparação. O horário contratado inclui montagem e desmontagem.",
      ],
    },
    {
      title: "Segurança e Responsabilidade",
      content: [
        "<strong>Medidas de segurança:</strong> Implementamos rigorosos protocolos de segurança em todos os nossos eventos, incluindo supervisão constante e materiais certificados.",
        "<strong>Adulto responsável:</strong> É obrigatória a presença de pelo menos um adulto responsável pelas crianças durante todo o evento. Embora nossos monitores sejam especializados, a responsabilidade final sobre as crianças é dos pais ou responsáveis.",
        "<strong>Condições especiais:</strong> Informações sobre alergias, necessidades especiais ou restrições de saúde das crianças devem ser comunicadas previamente à nossa equipe.",
        "A Vivalegria não realiza eventos em ambientes que apresentem riscos à integridade das crianças ou da equipe.",
        "Caso o ambiente seja considerado inadequado no dia do evento, a Vivalegria se reserva o direito de não realizar o serviço, sem devolução de valores.",
      ],
    },
    {
      title: "Condições Climáticas",
      content: [
        "<strong>Eventos externos:</strong> Para eventos ao ar livre, o contratante deve ter um plano alternativo (espaço coberto interno) em caso de chuva ou condições climáticas adversas.",
        "<strong>Adaptação:</strong> Nossa equipe trabalhará em conjunto com o contratante para adaptar as atividades ao espaço interno quando necessário.",
        "A Vivalegria não se responsabiliza por atrasos ou impossibilidade de realização devido a condições climáticas extremas, mas trabalhará para encontrar soluções ou negociar nova data.",
        "Eventos cancelados exclusivamente por condições climáticas podem ser reagendados sem aplicação de multa, sujeito à disponibilidade.",
      ],
    },
    {
      title: "Atendimento e Suporte",
      content: [
        "<strong>Canais de atendimento:</strong> WhatsApp (11) 96598-2251 e e-mail contato@vivalegria.com.br",
        "<strong>Horário de atendimento:</strong> Segunda a Sexta das 9h às 18h, Sábados das 9h às 12h.",
        "<strong>Prazo de resposta:</strong> Nos comprometemos a responder todas as solicitações em até 24 horas úteis.",
        "Em dias de evento, nossa equipe de suporte está disponível via WhatsApp para atendimento emergencial.",
      ],
    },
    {
      title: "Garantias do Cliente",
      content: [
        "<strong>Qualidade garantida:</strong> Nos comprometemos a entregar um serviço de alta qualidade conforme descrito no orçamento aprovado.",
        "<strong>Insatisfação:</strong> Caso o serviço não corresponda ao contratado, o cliente pode registrar reclamação em até 72 horas após o evento para análise e possível compensação.",
        "<strong>Atraso da equipe:</strong> Em caso de atraso superior a 15 minutos por responsabilidade da Vivalegria, será oferecido desconto proporcional ou extensão do horário.",
        "<strong>Benefícios para clientes frequentes:</strong> Clientes que realizarem mais de 3 eventos no ano têm direito a condições especiais em futuras contratações.",
      ],
    },
    {
      title: "Direitos de Imagem",
      content: [
        "A Vivalegria pode registrar fotos e vídeos durante o evento para fins institucionais e de divulgação em redes sociais e site oficial.",
        "As imagens captadas são utilizadas exclusivamente para fins de marketing e portfólio da empresa.",
        "Caso não deseje autorizar o uso de imagem, o contratante deve informar por escrito antes do evento.",
        "Respeitamos integralmente a privacidade das crianças e famílias, não divulgando informações pessoais junto às imagens.",
      ],
    },
    {
      title: "Feedback e Avaliações",
      content: [
        "<strong>Melhoria contínua:</strong> Valorizamos o feedback de nossos clientes para aprimorar constantemente nossos serviços.",
        "Após cada evento, enviamos um formulário de avaliação por WhatsApp ou e-mail.",
        "Depoimentos e avaliações positivas podem ser utilizados em nosso site e redes sociais, sempre preservando a privacidade do cliente quando solicitado.",
        "Reclamações e sugestões são tratadas com prioridade pela nossa equipe de qualidade.",
      ],
    },
    {
      title: "Política de Privacidade (LGPD)",
      content: [
        "<strong>Coleta de dados:</strong> Coletamos apenas os dados necessários para a prestação do serviço (nome, telefone, e-mail, endereço do evento).",
        "<strong>Uso dos dados:</strong> Seus dados são utilizados exclusivamente para comunicação relacionada ao evento contratado e eventual envio de promoções (com seu consentimento).",
        "<strong>Compartilhamento:</strong> Não compartilhamos seus dados com terceiros, exceto quando necessário para a execução do serviço ou por exigência legal.",
        "<strong>Retenção:</strong> Mantemos seus dados pelo período necessário para cumprimento de obrigações legais e fiscais.",
        "<strong>Seus direitos:</strong> Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através do e-mail contato@vivalegria.com.br",
      ],
    },
    {
      title: "Alterações nos Termos",
      content: [
        "A Vivalegria reserva-se o direito de modificar estes Termos e Condições a qualquer momento.",
        "Alterações significativas serão comunicadas aos clientes ativos por e-mail ou WhatsApp com antecedência mínima de 15 dias.",
        "A versão mais atualizada estará sempre disponível em nosso site.",
        "O uso continuado de nossos serviços após alterações implica aceitação dos novos termos.",
      ],
    },
    {
      title: "Contato",
      content: [
        "Para dúvidas, sugestões ou solicitações relacionadas a estes Termos e Condições, entre em contato conosco:",
        "<strong>WhatsApp:</strong> (11) 96598-2251",
        "<strong>E-mail:</strong> contato@vivalegria.com.br",
        "<strong>Horário:</strong> Segunda a Sexta das 9h às 18h, Sábados das 9h às 12h",
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Termos e Condições | Vivalegria"
        description="Termos e Condições da Vivalegria Recreação. Conheça as condições para contratação de nossos serviços de recreação infantil."
        canonical="/termos"
      />

      <div className="min-h-screen pt-20 bg-background">
        {/* Hero */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-balance">Termos e Condições</h1>
              <p className="text-lg text-muted-foreground">
                Políticas e diretrizes para garantir eventos seguros e bem-sucedidos
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
                {sections.map((section, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-xl overflow-hidden bg-card"
                  >
                    <AccordionTrigger className="px-8 py-6 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFD836]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FF731D] font-bold">{index + 1}</span>
                        </div>
                        <h2 className="text-xl font-bold text-left">{section.title}</h2>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6">
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#FF731D] mt-1 flex-shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Contact Card */}
              <Card className="p-8 bg-[#FFF8E6]">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Dúvidas sobre os Termos?</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Entre em contato conosco para esclarecer qualquer dúvida sobre nossos termos e condições.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                      href="https://wa.me/5511965982251"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FF731D] hover:underline"
                    >
                      <Phone className="w-5 h-5" />
                      (11) 96598-2251
                    </a>
                    <a
                      href="mailto:contato@vivalegria.com.br"
                      className="flex items-center gap-2 text-[#FF731D] hover:underline"
                    >
                      <Mail className="w-5 h-5" />
                      contato@vivalegria.com.br
                    </a>
                  </div>
                </div>
              </Card>

              {/* Acceptance */}
              <Card className="p-8 border-[#FF731D]/30">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold">Aceitação dos Termos</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Ao contratar os serviços da Vivalegria Recreação, você declara que leu, compreendeu e concorda
                    com todos os termos e condições descritos nesta página.
                  </p>
                  <p className="text-sm text-muted-foreground">Última atualização: Dezembro de 2025</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Termos;
