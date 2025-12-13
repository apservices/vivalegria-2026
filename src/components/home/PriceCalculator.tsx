import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, MessageCircle, Sparkles } from "lucide-react";

const pricingData: Record<number, { classico: number; select: number }> = {
  15: { classico: 589.9, select: 789.9 },
  20: { classico: 764.9, select: 969.9 },
  25: { classico: 914.9, select: 1119.9 },
  30: { classico: 1064.9, select: 1269.9 },
  35: { classico: 1189.9, select: 1389.9 },
  40: { classico: 1314.9, select: 1519.9 },
  45: { classico: 1439.9, select: 1639.9 },
  50: { classico: 1564.9, select: 1769.9 },
};

const getClosestPrice = (children: number) => {
  const keys = Object.keys(pricingData).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - children) < Math.abs(prev - children) ? curr : prev
  );
  return pricingData[closest];
};

const PriceCalculator = () => {
  const [children, setChildren] = useState(20);
  const [selectedPackage, setSelectedPackage] = useState<"classico" | "select">(
    "select"
  );

  const prices = getClosestPrice(children);
  const currentPrice = prices[selectedPackage];

  const whatsappMessage = encodeURIComponent(
    `OlÃƒÂ¡! Ã°Å¸Å½â€° Gostaria de reservar o *Pacote ${
      selectedPackage === "select" ? "SELECT" : "CLÃƒÂSSICO"
    }* para *${children} crianÃƒÂ§as*.\n\nValor: R$ ${currentPrice
      .toFixed(2)
      .replace(".", ",")}\n\nPode me ajudar com o agendamento?`
  );

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-primary/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Calculadora de PreÃƒÂ§os
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Monte seu OrÃƒÂ§amento em Segundos
          </h2>

          <p className="text-xl text-muted-foreground">
            Selecione o nÃƒÂºmero de crianÃƒÂ§as e veja o valor na hora!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 shadow-2xl border-2 border-secondary/30">
            {/* Children Slider */}
            <div className="mb-10">
              <label className="block text-lg font-semibold mb-4">
                Quantas crianÃƒÂ§as terÃƒÂ¡ na festa?
              </label>

              <div className="flex items-center gap-6">
                <Slider
                  value={[children]}
                  onValueChange={(value) => setChildren(value[0])}
                  min={15}
                  max={50}
                  step={5}
                  className="flex-1"
                />

                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-foreground">
                    {children}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Arraste para ajustar (15Ã¢â‚¬â€œ50 crianÃƒÂ§as)
              </p>
            </div>

            {/* Package Selection */}
            <div className="mb-10">
              <label className="block text-lg font-semibold mb-4">
                Escolha seu pacote:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPackage("classico")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    selectedPackage === "classico"
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                  type="button"
                >
                  <h4 className="text-xl font-bold mb-2">Pacote CLÃƒÂSSICO</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    3 horas Ã¢â‚¬Â¢ 1 recreador
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {prices.classico.toFixed(2).replace(".", ",")}
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPackage("select")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative ${
                    selectedPackage === "select"
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                  type="button"
                >
                  <div className="absolute -top-3 right-4">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      MAIS POPULAR
                    </span>
                  </div>

                  <h4 className="text-xl font-bold mb-2">Pacote SELECT</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    4 horas Ã¢â‚¬Â¢ 2 recreadores
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {prices.select.toFixed(2).replace(".", ",")}
                  </p>
                </button>
              </div>
            </div>

            {/* Result */}
            <div className="bg-muted rounded-2xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valor do seu evento:
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    R$ {currentPrice.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPackage === "select"
                      ? "4 horas + 2 recreadores"
                      : "3 horas + 1 recreador"}
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-lg px-8 h-14 bg-[#25D366] hover:bg-[#20BD5A] shadow-lg"
                >
                  <a
                    href={`https://wa.me/5511965982251?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Reservar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Ã°Å¸â€œÂ Valores para SÃƒÂ£o Paulo e regiÃƒÂ£o. Taxa de deslocamento pode ser
              aplicada.
              <br />
              50% de sinal via PIX para reservar sua data.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
