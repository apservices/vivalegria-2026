import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { formatPrice, childrenRanges, type WorkshopType } from "@/utils/pricing";
import { calculateWorkshopPrice } from "@/utils/pricing";
import { ContratacaoForm } from "@/components/ContratacaoForm";

import oficinaCupcake from "@/assets/oficina-cupcake.jpg";
import oficinaMicangas from "@/assets/oficina-micangas.jpg";
import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaSlime from "@/assets/oficina-slime.jpg";
import oficinaJardinagem from "@/assets/oficina-jardinagem.jpg";

const Contratar = () => {
  const {
    packageType,
    numChildren,
    selectedWorkshops,
    selectedExtras,
    setPackageType,
    setNumChildren,
    toggleWorkshop,
    toggleExtra,
    calculateTotal,
    getWhatsAppMessage,
  } = useConfigurator();

  const packages = [
    {
      id: "classic" as const,
      name: "Classic",
      description: "Diversão garantida com brincadeiras clássicas",
      features: [
        "Recreadores especializados",
        "Brincadeiras clássicas",
        "Duração: 4 horas",
        "Material de qualidade",
      ],
    },
    {
      id: "select" as const,
      name: "Select",
      description: "Experiência premium com atividades exclusivas",
      features: [
        "Tudo do Classic",
        "Atividades temáticas",
        "Pintura facial básica",
        "Massinha + paraquedas",
        "Presente para aniversariante",
        "Kit piquenique completo",
      ],
    },
  ];

  const workshops = [
    {
      id: "slime" as WorkshopType,
      name: "Slime",
      description: "Criação de slimes coloridos e divertidos",
      image: oficinaSlime,
    },
    {
      id: "micangas" as WorkshopType,
      name: "Miçangas",
      description: "Criação de bijuterias e acessórios",
      image: oficinaMicangas,
    },
    {
      id: "cupcake" as WorkshopType,
      name: "Cupcake",
      description: "Decoração de cupcakes deliciosos",
      image: oficinaCupcake,
    },
    {
      id: "tela" as WorkshopType,
      name: "Pintura em Tela",
      description: "Arte em tela para pequenos artistas",
      image: oficinaPintura,
    },
    {
      id: "jardinagem" as WorkshopType,
      name: "Jardinagem",
      description: "Plantio e cuidados com plantas",
      image: oficinaJardinagem,
    },
  ];

  const extras = [
    { id: "recreador" as const, name: "Recreador adicional", price: 180 },
    { id: "apoio" as const, name: "Apoio adicional", price: 140 },
    { id: "hora_extra" as const, name: "Hora extra", price: 200 },
  ];

  const scrollToForm = () => {
    const formElement = document.getElementById("contratacao-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Contratar Recreação Infantil | Configure seu Pacote | Vivalegria"
        description="Monte o pacote ideal de recreação infantil: escolha Clássico ou Select, adicione oficinas criativas e reserve em minutos para toda a Grande SP."
        canonical="/contratar"
      />
      <JsonLd
        type="breadcrumb"
        breadcrumbItems={[
          { name: "Início", path: "/" },
          { name: "Contratar", path: "/contratar" },
        ]}
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-12 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-balance">Monte Seu Pacote Ideal</h1>
              <p className="text-lg text-muted-foreground">
                Configure seu evento em 4 passos simples
              </p>
            </div>
          </div>
        </section>

        {/* Configurator */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Column */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Step 1: Package Selection */}
                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-2">Passo 1</Badge>
                      <h2 className="text-3xl font-bold">Escolha o Pacote</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {packages.map((pkg) => (
                        <Card
                          key={pkg.id}
                          className={`p-6 cursor-pointer transition-all duration-300 ${
                            packageType === pkg.id
                              ? "border-[#FF731D] border-2 shadow-lg"
                              : "border-border hover:border-[#FF731D]/50"
                          }`}
                          onClick={() => setPackageType(pkg.id)}
                        >
                          <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                          <p className="text-muted-foreground mb-4">{pkg.description}</p>

                          <ul className="space-y-2">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="w-5 h-5 text-[#FF731D] mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Children Count */}
                  {packageType && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <Badge className="mb-2">Passo 2</Badge>
                        <h2 className="text-3xl font-bold">Número de Crianças</h2>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {childrenRanges.map((range) => (
                          <Button
                            key={range.value}
                            variant={numChildren === range.value ? "default" : "outline"}
                            onClick={() => setNumChildren(range.value)}
                            className="flex-1 min-w-[120px]"
                          >
                            {range.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Workshops */}
                  {packageType && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <Badge className="mb-2">Passo 3</Badge>
                        <h2 className="text-3xl font-bold">Oficinas Criativas</h2>
                        <p className="text-muted-foreground mt-2">
                          Opcional - Adicione oficinas ao seu evento
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {workshops.map((workshop) => (
                          <Card
                            key={workshop.id}
                            className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                              selectedWorkshops.includes(workshop.id)
                                ? "border-[#FF731D] border-2 shadow-lg"
                                : "border-border hover:border-[#FF731D]/50"
                            }`}
                            onClick={() => toggleWorkshop(workshop.id)}
                          >
                            <div className="aspect-video relative overflow-hidden">
                              <img
                                src={workshop.image}
                                alt={workshop.name}
                                className="w-full h-full object-cover"
                              />
                              {selectedWorkshops.includes(workshop.id) && (
                                <div className="absolute top-2 right-2 bg-[#FF731D] text-white rounded-full p-1">
                                  <Check className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-1">{workshop.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{workshop.description}</p>
                              <p className="text-[#FF731D] font-semibold">
                                + R$ {formatPrice(calculateWorkshopPrice(workshop.id, numChildren || 15))}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Extras */}
                  {packageType && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <Badge className="mb-2">Passo 4</Badge>
                        <h2 className="text-3xl font-bold">Extras</h2>
                        <p className="text-muted-foreground mt-2">
                          Opcional - Personalize ainda mais
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        {extras.map((extra) => (
                          <Card
                            key={extra.id}
                            className={`p-6 cursor-pointer transition-all duration-300 ${
                              selectedExtras.includes(extra.id)
                                ? "border-[#FF731D] border-2 shadow-lg"
                                : "border-border hover:border-[#FF731D]/50"
                            }`}
                            onClick={() => toggleExtra(extra.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold">{extra.name}</h3>
                              {selectedExtras.includes(extra.id) && (
                                <Check className="w-5 h-5 text-[#FF731D] flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[#FF731D] font-semibold">
                              + R$ {formatPrice(extra.price)}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1">
                  <Card className="p-6 sticky top-24 space-y-6 border-[#FFD836] border-2">
                    <h3 className="text-2xl font-bold">Resumo</h3>

                    {!packageType ? (
                      <p className="text-muted-foreground text-center py-8">
                        Selecione um pacote para começar
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="pb-3 border-b">
                            <p className="text-sm text-muted-foreground">Pacote</p>
                            <p className="font-semibold">{packageType === "classic" ? "Classic" : "Select"}</p>
                          </div>

                          <div className="pb-3 border-b">
                            <p className="text-sm text-muted-foreground">Crianças</p>
                            <p className="font-semibold">{numChildren} crianças</p>
                          </div>

                          {selectedWorkshops.length > 0 && (
                            <div className="pb-3 border-b">
                              <p className="text-sm text-muted-foreground mb-1">Oficinas</p>
                              <ul className="space-y-1">
                                {selectedWorkshops.map((w) => (
                                  <li key={w} className="text-sm">
                                    • {workshops.find((ws) => ws.id === w)?.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {selectedExtras.length > 0 && (
                            <div className="pb-3 border-b">
                              <p className="text-sm text-muted-foreground mb-1">Extras</p>
                              <ul className="space-y-1">
                                {selectedExtras.map((e) => (
                                  <li key={e} className="text-sm">
                                    • {extras.find((ex) => ex.id === e)?.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t-2 border-[#FFD836]">
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-3xl font-bold text-[#FF731D]">
                            R$ {formatPrice(calculateTotal())}
                          </p>
                        </div>

                        <Button onClick={scrollToForm} className="w-full" size="lg">
                          Reservar Agora
                          <ArrowRight className="ml-2" />
                        </Button>

                        <a
                          href={getWhatsAppMessage()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full" size="lg">
                            📱 Falar no WhatsApp
                          </Button>
                        </a>
                      </>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário de Contratação */}
        {packageType && (
          <section id="contratacao-form" className="py-16 bg-viva-offwhite">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Complete Sua Reserva</h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo para finalizar sua reserva
                  </p>
                </div>
                <ContratacaoForm />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Contratar;
