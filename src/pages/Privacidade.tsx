import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
const Privacidade = () => {
  return (
    <>
      <SEO
        title="PolÃ­tica de Privacidade"
        description="PolÃ­tica de Privacidade da Vivalegria RecreaÃ§Ã£o. Saiba como protegemos seus dados pessoais."
        canonical="/privacidade"
      />
      <div className="min-h-screen pt-20">
        <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">PolÃ­tica de Privacidade</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ãšltima atualizaÃ§Ã£o: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. IntroduÃ§Ã£o</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Vivalegria RecreaÃ§Ã£o estÃ¡ comprometida em proteger a privacidade e seguranÃ§a dos dados pessoais 
                    de seus clientes, parceiros e visitantes do site. Esta PolÃ­tica de Privacidade descreve como 
                    coletamos, usamos, armazenamos e protegemos suas informaÃ§Ãµes pessoais.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">2. InformaÃ§Ãµes que Coletamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Coletamos as seguintes informaÃ§Ãµes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Nome completo, telefone e e-mail fornecidos em formulÃ¡rios de contato</li>
                    <li>InformaÃ§Ãµes sobre o evento (data, tipo, nÃºmero de crianÃ§as)</li>
                    <li>Dados de navegaÃ§Ã£o atravÃ©s de cookies (endereÃ§o IP, navegador, pÃ¡ginas visitadas)</li>
                    <li>ComunicaÃ§Ãµes realizadas conosco via WhatsApp, e-mail ou telefone</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Como Usamos suas InformaÃ§Ãµes</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Utilizamos seus dados para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Responder suas solicitaÃ§Ãµes de orÃ§amento e agendamento</li>
                    <li>Prestar nossos serviÃ§os de recreaÃ§Ã£o infantil</li>
                    <li>Enviar comunicaÃ§Ãµes sobre seu evento</li>
                    <li>Melhorar nossos serviÃ§os e experiÃªncia do usuÃ¡rio</li>
                    <li>Cumprir obrigaÃ§Ãµes legais e contratuais</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Compartilhamento de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    NÃ£o vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. 
                    Podemos compartilhar informaÃ§Ãµes apenas com fornecedores essenciais para a prestaÃ§Ã£o dos serviÃ§os 
                    (ex: sistema de agendamento) e quando exigido por lei.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies para melhorar a experiÃªncia de navegaÃ§Ã£o. VocÃª pode gerenciar ou desativar 
                    cookies atravÃ©s das configuraÃ§Ãµes do seu navegador. Note que isso pode afetar algumas 
                    funcionalidades do site.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">6. SeguranÃ§a dos Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas tÃ©cnicas e organizacionais para proteger seus dados contra acesso nÃ£o 
                    autorizado, perda ou alteraÃ§Ã£o. Todos os dados sÃ£o armazenados em servidores seguros com 
                    criptografia.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Seus Direitos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    De acordo com a LGPD (Lei Geral de ProteÃ§Ã£o de Dados), vocÃª tem direito a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Acessar seus dados pessoais que possuÃ­mos</li>
                    <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                    <li>Solicitar a exclusÃ£o de seus dados</li>
                    <li>Revogar o consentimento a qualquer momento</li>
                    <li>Solicitar a portabilidade dos dados</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">8. RetenÃ§Ã£o de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Mantemos seus dados pelo tempo necessÃ¡rio para cumprir as finalidades descritas nesta polÃ­tica, 
                    salvo se um perÃ­odo de retenÃ§Ã£o maior for exigido por lei.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">9. Contato</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para exercer seus direitos ou esclarecer dÃºvidas sobre esta polÃ­tica, entre em contato:
                  </p>
                  <ul className="list-none pl-0 mt-3 space-y-1 text-muted-foreground">
                    <li><strong>E-mail:</strong> contato@vivalegria.com.br</li>
                    <li><strong>Telefone:</strong> (11) 96598-2251</li>
                    <li><strong>WhatsApp:</strong> (11) 96598-2251</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Esta PolÃ­tica de Privacidade pode ser atualizada periodicamente. Recomendamos que vocÃª 
                    revise esta pÃ¡gina regularmente para se manter informado sobre como protegemos seus dados.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};
export default Privacidade;
