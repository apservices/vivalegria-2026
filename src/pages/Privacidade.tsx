import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";

const Privacidade = () => {
  return (
    <>
      <SEO
        title="Política de Privacidade"
        description="Política de Privacidade da Vivalegria Recreação. Saiba como protegemos seus dados pessoais."
        canonical="/privacidade"
      />
      <div className="min-h-screen pt-20">
        <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Vivalegria Recreação está comprometida em proteger a privacidade e segurança dos dados pessoais 
                    de seus clientes, parceiros e visitantes do site. Esta Política de Privacidade descreve como 
                    coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Informações que Coletamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Coletamos as seguintes informações:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Nome completo, telefone e e-mail fornecidos em formulários de contato</li>
                    <li>Informações sobre o evento (data, tipo, número de crianças)</li>
                    <li>Dados de navegação através de cookies (endereço IP, navegador, páginas visitadas)</li>
                    <li>Comunicações realizadas conosco via WhatsApp, e-mail ou telefone</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Como Usamos suas Informações</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Utilizamos seus dados para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Responder suas solicitações de orçamento e agendamento</li>
                    <li>Prestar nossos serviços de recreação infantil</li>
                    <li>Enviar comunicações sobre seu evento</li>
                    <li>Melhorar nossos serviços e experiência do usuário</li>
                    <li>Cumprir obrigações legais e contratuais</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Compartilhamento de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing. 
                    Podemos compartilhar informações apenas com fornecedores essenciais para a prestação dos serviços 
                    (ex: sistema de agendamento) e quando exigido por lei.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies para melhorar a experiência de navegação. Você pode gerenciar ou desativar 
                    cookies através das configurações do seu navegador. Note que isso pode afetar algumas 
                    funcionalidades do site.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Segurança dos Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não 
                    autorizado, perda ou alteração. Todos os dados são armazenados em servidores seguros com 
                    criptografia.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Seus Direitos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Acessar seus dados pessoais que possuímos</li>
                    <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                    <li>Solicitar a exclusão de seus dados</li>
                    <li>Revogar o consentimento a qualquer momento</li>
                    <li>Solicitar a portabilidade dos dados</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Retenção de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política, 
                    salvo se um período de retenção maior for exigido por lei.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">9. Contato</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                  </p>
                  <ul className="list-none pl-0 mt-3 space-y-1 text-muted-foreground">
                    <li><strong>E-mail:</strong> contato@vivalegria.com.br</li>
                    <li><strong>Telefone:</strong> (11) 96598-2251</li>
                    <li><strong>WhatsApp:</strong> (11) 96598-2251</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você 
                    revise esta página regularmente para se manter informado sobre como protegemos seus dados.
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