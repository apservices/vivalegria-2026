import { Check, ArrowRight, Star, Info, Sparkles, Baby } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { formatPrice, getMinimumPrice } from "@/utils/pricing";
const Pacotes = () => {
  const packages = [
    {
      name: "Pacote SELECT",
      badge: "RECOMENDADO",
      badgeIcon: Star,
      audience: "ExperiÃªncia completa e inesquecÃ­vel",
      description: "4 horas de recreaÃ§Ã£o com 2 recreadores profissionais",
      features: [
        "2 recreadores profissionais",
        "4 horas de recreaÃ§Ã£o",
        "Pintura facial bÃ¡sica",
        "CaÃ§a ao tesouro personalizada",
        "Escultura de balÃ£o",
        "Tatuagem infantil",
        "Massinha + paraquedas",
        "Jogos e brincadeiras clÃ¡ssicas",
        "Presente especial para o aniversariante",
        "Toalha de piquenique xadrez + kit desenho",
        "Brincadeiras com cordas, bolas e cones"],
      color: "viva-orange",
      featured: true,
      startPrice: `R$ ${formatPrice(getMinimumPrice("package", "select"))}`,
    },
    {
      name: "Pacote CLÃSSICO",
      badge: null,
      badgeIcon: null,
      audience: "DiversÃ£o garantida com o essencial",
      description: "4 horas de recreaÃ§Ã£o com 1 recreador",
      features: [
        "1 recreador",
        "4 horas de recreaÃ§Ã£o",
        "Escultura de balÃ£o",
        "Tatuagem infantil",
        "CaÃ§a ao tesouro",
        "Toalha de piquenique + kit desenho",
        "Brincadeiras com cordas, bolas e cones"],
      color: "viva-sun",
      startPrice: `R$ ${formatPrice(getMinimumPrice("package", "classic"))}`,
    }];
  const premiumPackages = [
    {
      name: "Baladinha Kids",
      badge: "PREMIUM",
      badgeIcon: Sparkles,
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      audience: "ExperiÃªncia danÃ§ante mÃ¡gica!",
      description: "2 horas de festa com estrutura profissional",
      features: [
        "Estrutura 3x3m com pista iluminada",
        "Luzes LED profissionais",
        "Caixa de som potente",
        "MÃ¡quina de fumaÃ§a",
        "Playlist personalizada",
        "AtÃ© 20 crianÃ§as inclusas",
        "+R$30 por crianÃ§a extra",
        "+R$200 por hora extra"],
      startPrice: "R$ 989,00",
      note: "Pode ser contratada com ou sem recreaÃ§Ã£o â€” consulte no WhatsApp!",
    },
    {
      name: "Ãrea Baby",
      badge: "BEBÃŠS",
      badgeIcon: Baby,
      badgeColor: "bg-gradient-to-r from-sky-400 to-teal-400",
      audience: "EspaÃ§o especial para os menores",
      description: "2 horas com profissionais especializados",
      features: [
        "EspaÃ§o dedicado e seguro",
        "Atividades sensoriais",
        "Brinquedos adequados para bebÃªs",
        "Profissionais especializados",
        "AtÃ© 10 bebÃªs inclusos",
        "+R$25 por bebÃª extra"],
      startPrice: "R$ 679,90",
      note: "Pode ser contratada com ou sem recreaÃ§Ã£o â€” consulte no WhatsApp!",
    }];
  const faqs = [
    {
      question: "Quanto custa o pacote Select para 25 crianÃ§as?",
      answer: "O pacote Select para 25 crianÃ§as custa R$ 1.119,90. Este valor inclui 4 horas de recreaÃ§Ã£o, 2 recreadores profissionais, pintura facial, caÃ§a ao tesouro personalizada, escultura de balÃ£o, e muito mais!"
    },
    {
      question: "O que estÃ¡ incluso na recreaÃ§Ã£o clÃ¡ssica?",
      answer: "O Pacote ClÃ¡ssico inclui 4 horas de recreaÃ§Ã£o com 1 recreador, escultura de balÃ£o, tatuagem infantil, caÃ§a ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones."
    },
    {
      question: "VocÃªs atendem em toda SÃ£o Paulo?",
      answer: "Sim! Atendemos SÃ£o Paulo capital e regiÃ£o metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "PIX: Ã  vista ou 60% de sinal + 40% atÃ© 7 dias antes do evento. CartÃ£o: 3x sem juros acima de R$600 ou atÃ© 10x com juros. Emitimos contrato digital e nota fiscal."
    },
    {
      question: "Posso adicionar mais crianÃ§as depois de fechar o pacote?",
      answer: "Sim! VocÃª pode ajustar o nÃºmero de crianÃ§as atÃ© 3 dias antes do evento. Valores para mais de 50 crianÃ§as sÃ£o calculados sob consulta."
    },
    {
      question: "Os recreadores sÃ£o profissionais treinados?",
      answer: "Todos os nossos recreadores passam por treinamento especÃ­fico da Vivalegria, com foco em seguranÃ§a infantil, primeiros socorros, e tÃ©cnicas de animaÃ§Ã£o. SÃ£o profissionais experientes e apaixonados pelo que fazem!"
    },
    {
      question: "Qual a diferenÃ§a entre pintura artÃ­stica profissional e bÃ¡sica?",
      answer: "A pintura profissional inclui desenhos mais elaborados e detalhados, enquanto a bÃ¡sica oferece motivos mais simples mas igualmente divertidos. O pacote Select jÃ¡ inclui a pintura bÃ¡sica."
    },
    {
      question: "VocÃªs fornecem todos os materiais?",
      answer: "Sim! Todos os materiais necessÃ¡rios para as atividades estÃ£o inclusos nos pacotes. VocÃª sÃ³ precisa se preocupar com a festa!"
    }];
  return (
    <>
      <SEO
        title="RecreaÃ§Ã£o Infantil SP | Pacotes a Partir de R$589 | Vivalegria"
        description="Pacotes de recreaÃ§Ã£o infantil para festas em SÃ£o Paulo. Pacote Select com 4h e 2 recreadores a partir de R$789,90. Pacote ClÃ¡ssico 4h a partir de R$589,90. Baladinha Kids e Ãrea Baby disponÃ­veis!"
        keywords="recreaÃ§Ã£o infantil SÃ£o Paulo, pacote festa infantil preÃ§o, recreaÃ§Ã£o para festa infantil SP, animaÃ§Ã£o infantil preÃ§o, baladinha kids, Ã¡rea baby festa"
        canonical="/pacotes"
      />
      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Tabela de PreÃ§os 2025/2026 â€“ Vivalegria Festas</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Valores vÃ¡lidos para festas em SÃ£o Paulo e regiÃ£o (consulte taxa de deslocamento)
            </p>
          </div>
        </section>
        {/* Main Packages Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Pacotes de RecreaÃ§Ã£o</h2>
              <p className="text-lg text-muted-foreground">
                Escolha o pacote ideal para a sua festa
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`p-8 hover-lift ${pkg.featured ? 'border-primary border-2 shadow-hover' : ''}`}
                >
                  {pkg.badge && pkg.badgeIcon && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1">
                      <pkg.badgeIcon className="w-3 h-3" />
                      {pkg.badge}
                    </span>
                  )}
                  <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
                  <p className="text-sm text-primary font-semibold mb-3">{pkg.audience}</p>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="p-4 bg-gradient-subtle rounded-lg mb-6">
                    <p className="text-2xl font-bold text-primary">A partir de {pkg.startPrice}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Para atÃ© 15 crianÃ§as â€¢ Valores variam conforme quantidade
                    </p>
                  </div>
                  <div className="space-y-3 mb-8">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      O que estÃ¡ incluso:
                    </h3>
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full rounded-full" variant={pkg.featured ? "default" : "outline"}>
                    <Link to="/contratar">
                      Solicitar orÃ§amento
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Premium Packages */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">ExperiÃªncias Especiais</h2>
              <p className="text-lg text-muted-foreground">
                ServiÃ§os premium para tornar sua festa ainda mais incrÃ­vel
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {premiumPackages.map((pkg, index) => (
                <Card key={index} className="p-8 hover-lift border-2 border-dashed border-primary/30">
                  <span className={`${pkg.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1`}>
                    <pkg.badgeIcon className="w-3 h-3" />
                    {pkg.badge}
                  </span>
                  <h2 className="text-3xl font-bold mb-2">{pkg.name}</h2>
                  <p className="text-sm text-primary font-semibold mb-3">{pkg.audience}</p>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="p-4 bg-background rounded-lg mb-6 border">
                    <p className="text-2xl font-bold text-primary">A partir de {pkg.startPrice}</p>
                  </div>
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      O que estÃ¡ incluso:
                    </h3>
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {pkg.note && (
                    <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6 italic">
                      ðŸ’¡ {pkg.note}
                    </p>
                  )}
                  <Button asChild className="w-full rounded-full" variant="outline">
                    <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                      ðŸ’¬ Consultar no WhatsApp
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Payment Rules */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            {/* Payment Rules */}
            <div className="max-w-4xl mx-auto mt-12 p-6 bg-background rounded-xl border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-3">Formas de Pagamento:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>ðŸ’³ <strong>PIX:</strong> Ã  vista ou 60% de sinal + 40% atÃ© 7 dias antes do evento</li>
                    <li>ðŸ’³ <strong>CartÃ£o de crÃ©dito:</strong> 3x sem juros para compras acima de R$600</li>
                    <li>ðŸ’³ <strong>Parcelamento estendido:</strong> atÃ© 10x com juros repassados ao cliente</li>
                    <li>ðŸ“„ Contrato digital + nota fiscal em todos os pacotes</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-3">ObservaÃ§Ãµes:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>â€¢ Valores para atÃ© 50 crianÃ§as. Acima disso, consulte orÃ§amento personalizado.</li>
                      <li>â€¢ Taxa de deslocamento poderÃ¡ ser aplicada conforme regiÃ£o.</li>
                      <li>â€¢ Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Perguntas Frequentes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tire suas dÃºvidas sobre nossos pacotes de recreaÃ§Ã£o infantil
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-balance">Pronto para fazer seu orÃ§amento?</h2>
              <p className="text-xl text-muted-foreground">
                Entre em contato e vamos criar o evento perfeito para sua famÃ­lia!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-10 shadow-premium">
                  <Link to="/contratar">
                    Fazer orÃ§amento online
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10">
                  <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                    ðŸ’¬ WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Pacotes;
