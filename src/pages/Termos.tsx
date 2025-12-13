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
      title: "IntroduÃ§Ã£o",
      content: [
        "Bem-vindo aos Termos e CondiÃ§Ãµes da Vivalegria RecreaÃ§Ã£o. Ao contratar nossos serviÃ§os, vocÃª declara que leu, compreendeu e concorda com todas as condiÃ§Ãµes descritas neste documento.",
        "Estes termos aplicam-se a todos os serviÃ§os prestados pela Vivalegria, incluindo recreaÃ§Ã£o infantil, oficinas criativas, eventos corporativos e demais atividades oferecidas.",
        "Reservamo-nos o direito de atualizar estes termos a qualquer momento, sendo de responsabilidade do cliente verificar periodicamente eventuais alteraÃ§Ãµes."],
    },
    {
      title: "Reservas e Pagamentos",
      content: [
        "<strong>50% no ato da reserva:</strong> Para garantir sua data, Ã© necessÃ¡rio realizar o pagamento de 50% do valor total do serviÃ§o contratado.",
        "<strong>50% atÃ© 24 horas antes do evento:</strong> O saldo restante deve ser quitado com no mÃ­nimo 24 horas de antecedÃªncia.",
        "<strong>Formas de pagamento:</strong> Aceitamos PIX, transferÃªncia bancÃ¡ria, cartÃ£o de crÃ©dito (com acrÃ©scimo de taxa) e dinheiro.",
        "<strong>Importante:</strong> A falta de pagamento no prazo estipulado inviabiliza a realizaÃ§Ã£o do evento.",
        "<strong>InadimplÃªncia:</strong> Em caso de nÃ£o pagamento apÃ³s a prestaÃ§Ã£o do serviÃ§o, reservamo-nos o direito de realizar cobranÃ§a judicial e negativaÃ§Ã£o do CPF/CNPJ junto aos Ã³rgÃ£os de proteÃ§Ã£o ao crÃ©dito."],
    },
    {
      title: "Cancelamento e Reagendamento",
      content: [
        "<strong>Cancelamento com 7 dias ou mais de antecedÃªncia:</strong> Multa de 50% do valor total contratado.",
        "<strong>Cancelamento com menos de 7 dias de antecedÃªncia:</strong> Multa de 80% do valor total contratado.",
        "<strong>Reagendamento:</strong> SolicitaÃ§Ãµes de reagendamento devem ser feitas com no mÃ­nimo 7 dias de antecedÃªncia e estÃ£o sujeitas Ã  disponibilidade de data. Cada contrato permite apenas um reagendamento sem custos adicionais.",
        "Os valores pagos apÃ³s aplicaÃ§Ã£o da multa serÃ£o devolvidos em atÃ© 15 dias Ãºteis.",
        "Casos excepcionais (doenÃ§as graves, emergÃªncias) serÃ£o analisados individualmente pela equipe Vivalegria."],
    },
    {
      title: "ServiÃ§os Prestados",
      content: [
        "<strong>Equipe qualificada:</strong> Nossos recreadores sÃ£o treinados e capacitados para atender crianÃ§as de diferentes faixas etÃ¡rias com seguranÃ§a e profissionalismo.",
        "<strong>Materiais inclusos:</strong> Todos os materiais necessÃ¡rios para as atividades contratadas sÃ£o fornecidos pela Vivalegria, exceto quando especificado em contrÃ¡rio.",
        "<strong>Responsabilidade do espaÃ§o:</strong> O contratante Ã© responsÃ¡vel por garantir um espaÃ§o adequado e seguro para a realizaÃ§Ã£o das atividades.",
        "<strong>Custos adicionais:</strong> Deslocamentos para locais fora da Ã¡rea de cobertura padrÃ£o (Grande SÃ£o Paulo) podem ter custos adicionais de transporte.",
        "<strong>HorÃ¡rios:</strong> Nossa equipe chegarÃ¡ com 30 minutos de antecedÃªncia para preparaÃ§Ã£o. O horÃ¡rio contratado inclui montagem e desmontagem."],
    },
    {
      title: "SeguranÃ§a e Responsabilidade",
      content: [
        "<strong>Medidas de seguranÃ§a:</strong> Implementamos rigorosos protocolos de seguranÃ§a em todos os nossos eventos, incluindo supervisÃ£o constante e materiais certificados.",
        "<strong>Adulto responsÃ¡vel:</strong> Ã‰ obrigatÃ³ria a presenÃ§a de pelo menos um adulto responsÃ¡vel pelas crianÃ§as durante todo o evento. Embora nossos monitores sejam especializados, a responsabilidade final sobre as crianÃ§as Ã© dos pais ou responsÃ¡veis.",
        "<strong>CondiÃ§Ãµes especiais:</strong> InformaÃ§Ãµes sobre alergias, necessidades especiais ou restriÃ§Ãµes de saÃºde das crianÃ§as devem ser comunicadas previamente Ã  nossa equipe.",
        "A Vivalegria nÃ£o realiza eventos em ambientes que apresentem riscos Ã  integridade das crianÃ§as ou da equipe.",
        "Caso o ambiente seja considerado inadequado no dia do evento, a Vivalegria se reserva o direito de nÃ£o realizar o serviÃ§o, sem devoluÃ§Ã£o de valores."],
    },
    {
      title: "CondiÃ§Ãµes ClimÃ¡ticas",
      content: [
        "<strong>Eventos externos:</strong> Para eventos ao ar livre, o contratante deve ter um plano alternativo (espaÃ§o coberto interno) em caso de chuva ou condiÃ§Ãµes climÃ¡ticas adversas.",
        "<strong>AdaptaÃ§Ã£o:</strong> Nossa equipe trabalharÃ¡ em conjunto com o contratante para adaptar as atividades ao espaÃ§o interno quando necessÃ¡rio.",
        "A Vivalegria nÃ£o se responsabiliza por atrasos ou impossibilidade de realizaÃ§Ã£o devido a condiÃ§Ãµes climÃ¡ticas extremas, mas trabalharÃ¡ para encontrar soluÃ§Ãµes ou negociar nova data.",
        "Eventos cancelados exclusivamente por condiÃ§Ãµes climÃ¡ticas podem ser reagendados sem aplicaÃ§Ã£o de multa, sujeito Ã  disponibilidade."],
    },
    {
      title: "Atendimento e Suporte",
      content: [
        "<strong>Canais de atendimento:</strong> WhatsApp (11) 96598-2251 e e-mail contato@vivalegria.com.br",
        "<strong>HorÃ¡rio de atendimento:</strong> Segunda a Sexta das 9h Ã s 18h, SÃ¡bados das 9h Ã s 12h.",
        "<strong>Prazo de resposta:</strong> Nos comprometemos a responder todas as solicitaÃ§Ãµes em atÃ© 24 horas Ãºteis.",
        "Em dias de evento, nossa equipe de suporte estÃ¡ disponÃ­vel via WhatsApp para atendimento emergencial."],
    },
    {
      title: "Garantias do Cliente",
      content: [
        "<strong>Qualidade garantida:</strong> Nos comprometemos a entregar um serviÃ§o de alta qualidade conforme descrito no orÃ§amento aprovado.",
        "<strong>InsatisfaÃ§Ã£o:</strong> Caso o serviÃ§o nÃ£o corresponda ao contratado, o cliente pode registrar reclamaÃ§Ã£o em atÃ© 72 horas apÃ³s o evento para anÃ¡lise e possÃ­vel compensaÃ§Ã£o.",
        "<strong>Atraso da equipe:</strong> Em caso de atraso superior a 15 minutos por responsabilidade da Vivalegria, serÃ¡ oferecido desconto proporcional ou extensÃ£o do horÃ¡rio.",
        "<strong>BenefÃ­cios para clientes frequentes:</strong> Clientes que realizarem mais de 3 eventos no ano tÃªm direito a condiÃ§Ãµes especiais em futuras contrataÃ§Ãµes."],
    },
    {
      title: "Direitos de Imagem",
      content: [
        "A Vivalegria pode registrar fotos e vÃ­deos durante o evento para fins institucionais e de divulgaÃ§Ã£o em redes sociais e site oficial.",
        "As imagens captadas sÃ£o utilizadas exclusivamente para fins de marketing e portfÃ³lio da empresa.",
        "Caso nÃ£o deseje autorizar o uso de imagem, o contratante deve informar por escrito antes do evento.",
        "Respeitamos integralmente a privacidade das crianÃ§as e famÃ­lias, nÃ£o divulgando informaÃ§Ãµes pessoais junto Ã s imagens."],
    },
    {
      title: "Feedback e AvaliaÃ§Ãµes",
      content: [
        "<strong>Melhoria contÃ­nua:</strong> Valorizamos o feedback de nossos clientes para aprimorar constantemente nossos serviÃ§os.",
        "ApÃ³s cada evento, enviamos um formulÃ¡rio de avaliaÃ§Ã£o por WhatsApp ou e-mail.",
        "Depoimentos e avaliaÃ§Ãµes positivas podem ser utilizados em nosso site e redes sociais, sempre preservando a privacidade do cliente quando solicitado.",
        "ReclamaÃ§Ãµes e sugestÃµes sÃ£o tratadas com prioridade pela nossa equipe de qualidade."],
    },
    {
      title: "PolÃ­tica de Privacidade (LGPD)",
      content: [
        "<strong>Coleta de dados:</strong> Coletamos apenas os dados necessÃ¡rios para a prestaÃ§Ã£o do serviÃ§o (nome, telefone, e-mail, endereÃ§o do evento).",
        "<strong>Uso dos dados:</strong> Seus dados sÃ£o utilizados exclusivamente para comunicaÃ§Ã£o relacionada ao evento contratado e eventual envio de promoÃ§Ãµes (com seu consentimento).",
        "<strong>Compartilhamento:</strong> NÃ£o compartilhamos seus dados com terceiros, exceto quando necessÃ¡rio para a execuÃ§Ã£o do serviÃ§o ou por exigÃªncia legal.",
        "<strong>RetenÃ§Ã£o:</strong> Mantemos seus dados pelo perÃ­odo necessÃ¡rio para cumprimento de obrigaÃ§Ãµes legais e fiscais.",
        "<strong>Seus direitos:</strong> VocÃª pode solicitar acesso, correÃ§Ã£o ou exclusÃ£o de seus dados a qualquer momento atravÃ©s do e-mail contato@vivalegria.com.br"],
    },
    {
      title: "AlteraÃ§Ãµes nos Termos",
      content: [
        "A Vivalegria reserva-se o direito de modificar estes Termos e CondiÃ§Ãµes a qualquer momento.",
        "AlteraÃ§Ãµes significativas serÃ£o comunicadas aos clientes ativos por e-mail ou WhatsApp com antecedÃªncia mÃ­nima de 15 dias.",
        "A versÃ£o mais atualizada estarÃ¡ sempre disponÃ­vel em nosso site.",
        "O uso continuado de nossos serviÃ§os apÃ³s alteraÃ§Ãµes implica aceitaÃ§Ã£o dos novos termos."],
    },
    {
      title: "Contato",
      content: [
        "Para dÃºvidas, sugestÃµes ou solicitaÃ§Ãµes relacionadas a estes Termos e CondiÃ§Ãµes, entre em contato conosco:",
        "<strong>WhatsApp:</strong> (11) 96598-2251",
        "<strong>E-mail:</strong> contato@vivalegria.com.br",
        "<strong>HorÃ¡rio:</strong> Segunda a Sexta das 9h Ã s 18h, SÃ¡bados das 9h Ã s 12h"],
    }];
  return (
    <>
      <SEO
        title="Termos e CondiÃ§Ãµes | Vivalegria"
        description="Termos e CondiÃ§Ãµes da Vivalegria RecreaÃ§Ã£o. ConheÃ§a as condiÃ§Ãµes para contrataÃ§Ã£o de nossos serviÃ§os de recreaÃ§Ã£o infantil."
        canonical="/termos"
      />
      <div className="min-h-screen pt-20 bg-background">
        {/* Hero */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-balance">Termos e CondiÃ§Ãµes</h1>
              <p className="text-lg text-muted-foreground">
                PolÃ­ticas e diretrizes para garantir eventos seguros e bem-sucedidos
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
                  <h3 className="text-xl font-bold">DÃºvidas sobre os Termos?</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Entre em contato conosco para esclarecer qualquer dÃºvida sobre nossos termos e condiÃ§Ãµes.
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
                  <h3 className="text-xl font-bold">AceitaÃ§Ã£o dos Termos</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Ao contratar os serviÃ§os da Vivalegria RecreaÃ§Ã£o, vocÃª declara que leu, compreendeu e concorda com todos os termos e condiÃ§Ãµes descritos nesta pÃ¡gina.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ãšltima atualizaÃ§Ã£o: Dezembro de 2024
                  </p>
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
