import { Check, ArrowRight, Star, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import { priceTableData, formatPrice } from "@/utils/pricing";

const Pacotes = () => {
  const packages = [
    {
      name: "Pacote SELECT",
      badge: "RECOMENDADO",
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
      startPrice: "R$ 789,90",
    },
    {
      name: "Pacote CLÁSSICO",
      badge: null,
      audience: "Diversão garantida com o essencial",
      description: "3 horas de recreação com 1 recreador",
      features: [
        "1 recreador",
        "3 horas de recreação",
        "Escultura de balão",
        "Tatuagem infantil",
        "Caça ao tesouro",
        "Toalha de piquenique + kit desenho",
        "Brincadeiras com cordas, bolas e cones",
      ],
      color: "viva-sun",
      startPrice: "R$ 589,90",
    },
  ];

  const faqs = [
    {
      question: "Quanto custa o pacote Select para 25 crianças?",
      answer: "O pacote Select para 25 crianças custa R$ 1.119,90. Este valor inclui 4 horas de recreação, 2 recreadores profissionais, pintura facial, caça ao tesouro personalizada, escultura de balão, e muito mais!"
    },
    {
      question: "O que está incluso na recreação clássica?",
      answer: "O Pacote Clássico inclui 3 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones."
    },
    {
      question: "Vocês atendem em toda São Paulo?",
      answer: "Sim! Atendemos São Paulo capital e região metropolitana. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento. Consulte-nos para mais detalhes."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Trabalhamos com 50% de sinal via PIX para reserva da data, e o restante pode ser pago no dia do evento. Aceitamos PIX, cartão e boleto. Emitimos contrato digital e nota fiscal."
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
        description="Pacotes de recreação infantil para festas em São Paulo. Pacote Select com 4h e 2 recreadores a partir de R$789,90. Pacote Clássico 3h a partir de R$589,90. Orçamento grátis!"
        keywords="recreação infantil São Paulo, pacote festa infantil preço, recreação para festa infantil SP, animação infantil preço, pacote recreação 20 crianças"
        canonical="/pacotes"
      />

      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Tabela de Preços 2025 – Vivalegria Festas</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Valores válidos para festas em São Paulo e região (consulte taxa de deslocamento)
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`p-8 hover-lift ${pkg.featured ? 'border-primary border-2 shadow-hover' : ''}`}
                >
                  {pkg.badge && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1">
                      <Star className="w-3 h-3" />
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

        {/* Price Table */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Valores por Quantidade de Crianças</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confira nossa tabela de preços completa para 2025
              </p>
            </div>

            <div className="max-w-6xl mx-auto overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Crianças</TableHead>
                    <TableHead className="text-center">
                      <div>Pintura Artística</div>
                      <div className="text-xs font-normal">Profissional</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div>Pintura Artística</div>
                      <div className="text-xs font-normal">Básica</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div>Oficina Pintura em Tela</div>
                      <div className="text-xs font-normal">ou Cupcake</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div>Oficinas Criativas</div>
                      <div className="text-xs font-normal">Slime / Miçangas / Jardinagem</div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div>Recreação</div>
                      <div className="text-xs font-normal">Clássica (3h)</div>
                    </TableHead>
                    <TableHead className="text-center bg-primary/10">
                      <div className="font-bold">Pacote SELECT</div>
                      <div className="text-xs font-normal">4h + 2 recreadores</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceTableData.map((row) => (
                    <TableRow key={row.children}>
                      <TableCell className="font-medium">{row.children}</TableCell>
                      <TableCell className="text-center">R$ {formatPrice(row.pinturaPro)}</TableCell>
                      <TableCell className="text-center">R$ {formatPrice(row.pinturaBasica)}</TableCell>
                      <TableCell className="text-center">R$ {formatPrice(row.oficinaTela)}</TableCell>
                      <TableCell className="text-center">R$ {formatPrice(row.oficinasCriativas)}</TableCell>
                      <TableCell className="text-center">R$ {formatPrice(row.classic)}</TableCell>
                      <TableCell className="text-center bg-primary/5 font-bold text-primary">
                        R$ {formatPrice(row.select)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Observations */}
            <div className="max-w-4xl mx-auto mt-12 p-6 bg-background rounded-xl border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-3">Observações importantes:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Valores para até 50 crianças. Acima disso, consulte orçamento personalizado.</li>
                    <li>• Taxa de deslocamento poderá ser aplicada conforme região.</li>
                    <li>• 50% de sinal via PIX para reserva da data.</li>
                    <li>• Contrato digital + nota fiscal.</li>
                    <li>• Pagamento facilitado: PIX, cartão ou boleto.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
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
        <section className="py-24 bg-gradient-subtle">
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
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
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
