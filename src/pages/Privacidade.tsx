import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";

const LAST_UPDATED = "13/12/2025";

const Privacidade = () => {
  return (
    <>
      <SEO
        title="Política de Privacidade | Vivalegria Recreação"
        description="Política de Privacidade da Vivalegria Recreação. Saiba como coletamos, usamos e protegemos seus dados pessoais."
        canonical="/privacidade"
      />

      <div className="min-h-screen pt-20">
        <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Última atualização: {LAST_UPDATED}
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
                    A Vivalegria Recreação está comprometida em proteger a privacidade e a segurança dos dados
                    pessoais de seus clientes, parceiros e visitantes do site. Esta Política de Privacidade
                    descreve como coletamos, usamos, armazenamos e protegemos suas informações.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Informações que coletamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Podemos coletar as seguintes informações:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Nome completo, telefone e e-mail fornecidos em formulários de contato e reserva</li>
                    <li>Informações sobre o evento (data, tipo, local e número de crianças)</li>
                    <li>
                      Dados de navegação por meio de cookies e tecnologias similares (ex.: endereço IP, navegador,
                      páginas visitadas)
                    </li>
                    <li>Comunicações realizadas conosco via WhatsApp, e-mail ou telefone</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Como usamos suas informações</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Utilizamos seus dados para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Responder solicitações de orçamento, dúvidas e agendamentos</li>
                    <li>Prestar os serviços de recreação infantil contratados</li>
                    <li>Enviar comunicações relacionadas ao seu evento</li>
                    <li>Melhorar nossos serviços e a experiência de navegação</li>
                    <li>Cumprir obrigações legais e contratuais</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Compartilhamento de dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Não vendemos nem alugamos seus dados pessoais. Podemos compartilhar informações apenas com
                    fornecedores essenciais para a prestação dos serviços (por exemplo, sistemas de atendimento,
                    hospedagem e infraestrutura) e quando exigido por lei ou por autoridades competentes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies para melhorar a experiência de navegação. Você pode gerenciar ou desativar
                    cookies nas configurações do seu navegador. Observe que isso pode afetar algumas
                    funcionalidades do site.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Segurança dos dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
                    autorizado, perda, alteração ou divulgação indevida. Quando aplicável, utilizamos criptografia
                    e controles de acesso em ambientes protegidos.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Seus direitos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    De acordo com a LGPD (Lei Geral de Proteção de Dados), você pode solicitar:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Confirmação da existência de tratamento de dados</li>
                    <li>Acesso aos seus dados pessoais</li>
                    <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                    <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
                    <li>Portabilidade dos dados, quando aplicável</li>
                    <li>Eliminação dos dados tratados com consentimento, quando aplicável</li>
                    <li>Revogação do consentimento, quando aplicável</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Retenção de dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política,
                    bem como para atender a exigências legais, regulatórias ou para resguardar direitos.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">9. Contato</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para exercer seus direitos ou esclarecer dúvidas, entre em contato:
                  </p>
                  <ul className="list-none pl-0 mt-3 space-y-1 text-muted-foreground">
                    <li>
                      <strong>E-mail:</strong> contato@vivalegria.com.br
                    </li>
                    <li>
                      <strong>Telefone / WhatsApp:</strong> (11) 96598-2251
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos revisar esta
                    página para acompanhar eventuais alterações.
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
