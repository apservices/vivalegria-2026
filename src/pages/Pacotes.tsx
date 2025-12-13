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
      audience: "Experiência completa e inesquecível",
      description: "4 horas de recreação com 2 recreadores profissionais",
      features: [
        "2 recreadores profissionais",
        "4 horas de recreação",
        "Pintura facial básica",
        "Caça ao tesouro personalizada",
        "Escultura de balão",
        "Tatuagem infantil",
        "Massinha + paraquedas",
        "Jogos e brincadeiras clássicas",
        "Presente especial para o aniversariante",
        "Toalha de piquenique xadrez + kit desenho",
        "Brincadeiras com cordas, bolas e cones",
      ],
      color: "viva-orange",
      featured: true,
      startPrice: `R$ ${formatPrice(getMinimumPrice("package", "select"))}`,
    },
    {
      name: "Pacote CLÁSSICO",
      badge: null,
      badgeIcon: null,
      audience: "Diversão garantida com o essencial",
      description: "4 horas de recreação com 1 recreador",
      features: [
        "1 recreador",
        "4 horas de recreação",
        "Escultura de balão",
        "Tatuagem infantil",
        "Caça ao tesouro",
        "Toalha de piquenique + kit desenho",
        "Brincadeiras com cordas, bolas e cones",
      ],
      color: "viva-sun",
      startPrice: `R$ ${formatPrice(getMinimumPrice("package", "classic"))}`,
    },
  ];

  const premiumPackages = [
    {
      name: "Baladinha Kids",
      badge: "PREMIUM",
      badgeIcon: Sparkles,
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      audience: "Experiência dançante mágica!",
      description: "2 horas de festa com estrutura profissional",
      features: [
        "Estrutura 3x3m com pista iluminada",
        "Luzes LED profissionais",
        "Caixa de som potente",
        "Máquina de fumaça",
        "Playlist personalizada",
        "Até 20 crianças inclusas",
        "+R$30 por criança extra",
        "+R$200 por hora extra",
      ],
      startPrice: "R$ 989,00",
      note: "Pode ser contratada com ou sem recreação — consulte no WhatsApp!",
    },
    {
      name: "Área Baby",
      badge: "BEBÊS",
      badgeIcon: Baby,
      badgeColor: "bg-gradient-to-r from-sky-400 to-teal-400",
      audience: "Espaço especial para os menores",
      description: "2 horas com profissionais especializados",
      features: [
        "Espaço dedicado e seguro",
        "Atividades sensoriais",
        "Brinquedos adequados para bebês",
        "Profissionais especializados",
        "Até 10 bebês inclusos",
        "+R$25 por bebê extra",
      ],
      startPrice: "R$ 679,90",
      note: "Pode ser contratada com ou sem recreação — consulte no WhatsApp!",
    },
  ];

  const faqs = [
    {
      question: "Quanto custa o pacote Select para 25 crianças?",
      answer: "O pacote Select para 25 crianças custa R$ 1.119,90. Este valor inclui 4 horas de recreação, 2 recreadores profissionais, pintura facial, caça ao tesouro personalizada, escultura de balão, e muito mais!"
    },
    {
      question: "O que está incluso na recreação clássica?",
      answer: "O Pacote Clássico inclui 4 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones."
    },
    {
      question: "Vocês atendem em toda São Paulo?",
      answer: "Sim! Atendemos São Paulo capital e região metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "PIX: à vista ou 60% de sinal + 40% até 7 dias antes do evento. Cartão: 3x sem juros acima de R$600 ou até 10x com juros. Emitimos contrato digital e nota fiscal."
    },
    {
      question: "Posso adicionar mais crianças depois de fechar o pacote?",
      answer: "Sim! Você pode ajustar o número de crianças até 3 dias antes do evento. Valores para mais de 50 crianças são calculados sob consulta."
    },
    {
      question: "Os recreadores são profissionais treinados?",
      answer: "Todos os nossos recreadores passam por treinamento específico da Vivalegria, com foco em segurança infantil, primeiros socorros, e técnicas de animação. São profissionais experientes e apaixonados pelo que fazem!"
    },
    {
      question: "Qual a diferença entre pintura artística profissional e básica?",
      answer: "A pintura profissional inclui desenhos mais elaborados e detalhados, enquanto a básica oferece motivos mais simples mas igualmente divertidos. O pacote Select já inclui a pintura básica."
    },
    {
      question: "Vocês fornecem todos os materiais?",
      answer: "Sim! Todos os materiais necessários para as atividades estão inclusos nos pacotes. Você só precisa se preocupar com a festa!"
    },
  ];

  return (
    <>
      <SEO
        title="Recreação Infantil SP | Pacotes a Partir de R$589 | Vivalegria"
        description="Pacotes de recreação infantil para festas em São Paulo. Pacote Select com 4h e 2 recreadores a partir de R$789,90. Pacote Clássico 4h a partir de R$589,90. Baladinha Kids e Área Baby disponíveis!"
        keywords="recreação infantil São Paulo, pacote festa infantil preço, recreação para festa infantil SP, animação infantil preço, baladinha kids, área baby festa"
        canonical="/pacotes"
      />

      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Tabela de Preços 2025/2026 – Vivalegria Festas</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Valores válidos para festas em São Paulo e região (consulte taxa de deslocamento)
            </p>
          </div>
        </section>

        {/* Main Packages Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Pacotes de Recreação</h2>
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
                      Para até 15 crianças • Valores variam conforme quantidade
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      O que está incluso:
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
                      Solicitar orçamento
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
              <h2 className="mb-4">Experiências Especiais</h2>
              <p className="text-lg text-muted-foreground">
                Serviços premium para tornar sua festa ainda mais incrível
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
                      O que está incluso:
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
                      💡 {pkg.note}
                    </p>
                  )}

                  <Button asChild className="w-full rounded-full" variant="outline">
                    <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                      💬 Consultar no WhatsApp
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
                    <li>💳 <strong>PIX:</strong> à vista ou 60% de sinal + 40% até 7 dias antes do evento</li>
                    <li>💳 <strong>Cartão de crédito:</strong> 3x sem juros para compras acima de R$600</li>
                    <li>💳 <strong>Parcelamento estendido:</strong> até 10x com juros repassados ao cliente</li>
                    <li>📄 Contrato digital + nota fiscal em todos os pacotes</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-3">Observações:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Valores para até 50 crianças. Acima disso, consulte orçamento personalizado.</li>
                      <li>• Taxa de deslocamento poderá ser aplicada conforme região.</li>
                      <li>• Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.</li>
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
                Tire suas dúvidas sobre nossos pacotes de recreação infantil
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
              <h2 className="text-balance">Pronto para fazer seu orçamento?</h2>
              <p className="text-xl text-muted-foreground">
                Entre em contato e vamos criar o evento perfeito para sua família!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-10 shadow-premium">
                  <Link to="/contratar">
                    Fazer orçamento online
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10">
                  <a href="https://wa.me/5511965982251" target="_blank" rel="noopener noreferrer">
                    💬 WhatsApp
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