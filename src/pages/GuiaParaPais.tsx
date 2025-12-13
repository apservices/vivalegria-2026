import { Link } from "react-router-dom";
import { 
  Brain, 
  Heart, 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  Lightbulb,
  TrendingUp,
  Sun,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/SEO";
const GuiaParaPais = () => {
  const developmentTopics = [
    {
      icon: Brain,
      title: "Desenvolvimento Cognitivo",
      description: "O brincar estruturado estimula o raciocÃ­nio lÃ³gico, resoluÃ§Ã£o de problemas e criatividade. Atividades guiadas desenvolvem habilidades essenciais para o aprendizado."
    },
    {
      icon: Heart,
      title: "InteligÃªncia Emocional",
      description: "Brincadeiras em grupo ensinam empatia, cooperaÃ§Ã£o e gestÃ£o de emoÃ§Ãµes. Monitores treinados facilitam interaÃ§Ãµes positivas e construtivas."
    },
    {
      icon: Palette,
      title: "ExpressÃ£o Criativa",
      description: "Oficinas artÃ­sticas permitem que crianÃ§as expressem sentimentos e ideias de forma Ãºnica, fortalecendo autoestima e identidade."
    }
  ];
  const partyChecklist = [
    "Definir data e horÃ¡rio com antecedÃªncia (mÃ­nimo 15 dias)",
    "Escolher tema ou oficinas de acordo com a idade das crianÃ§as",
    "Confirmar nÃºmero de convidados para dimensionar monitores",
    "Preparar espaÃ§o adequado (interno ou externo)",
    "Comunicar alergias ou restriÃ§Ãµes alimentares",
    "Ter Ã¡rea separada para os pais (opcional)",
    "Providenciar kit bÃ¡sico de primeiros socorros",
    "Definir horÃ¡rio de entrada e saÃ­da dos convidados"
  ];
  const safetyTips = [
    {
      title: "EspaÃ§o Seguro",
      description: "Verifique se o local Ã© livre de obstÃ¡culos e superfÃ­cies perigosas"
    },
    {
      title: "SupervisÃ£o Adequada",
      description: "Nossa equipe mantÃ©m proporÃ§Ã£o ideal de 1 monitor para cada 10-12 crianÃ§as"
    },
    {
      title: "Materiais Certificados",
      description: "Todos os materiais sÃ£o atÃ³xicos, hipoalergÃªnicos e aprovados pelo INMETRO"
    },
    {
      title: "Protocolos de Higiene",
      description: "SanitizaÃ§Ã£o de equipamentos antes, durante e apÃ³s o evento"
    }
  ];
  const creativityTopics = [
    {
      icon: Sparkles,
      title: "Arte como Ferramenta",
      description: "Atividades artÃ­sticas desenvolvem coordenaÃ§Ã£o motora fina, concentraÃ§Ã£o e autoconfianÃ§a. Cada obra Ã© uma conquista pessoal."
    },
    {
      icon: Lightbulb,
      title: "Oficinas Educativas",
      description: "Slime ensina quÃ­mica bÃ¡sica, jardinagem conecta com a natureza, pintura explora cores e formas. Aprender brincando Ã© mais eficaz."
    }
  ];
  const trendingIdeas = [
    {
      title: "Festas TemÃ¡ticas SustentÃ¡veis",
      description: "DecoraÃ§Ã£o eco-friendly, oficinas de reciclagem criativa e jogos que ensinam sobre meio ambiente"
    },
    {
      title: "ExperiÃªncias Sensoriais",
      description: "Massinha caseira, slime texturizado e pintura com diferentes materiais para estimular todos os sentidos"
    },
    {
      title: "Festa no Estilo Maker",
      description: "CrianÃ§as criam suas prÃ³prias lembrancinhas em oficinas interativas"
    },
    {
      title: "CelebraÃ§Ã£o Multi-Idade",
      description: "EstaÃ§Ãµes de atividades adaptadas para diferentes faixas etÃ¡rias no mesmo evento"
    }
  ];
  return (
    <>
      <SEO
        title="Guia para Pais | Vivalegria RecreaÃ§Ã£o"
        description="Dicas essenciais para pais: desenvolvimento infantil, organizaÃ§Ã£o de festas, seguranÃ§a, educaÃ§Ã£o criativa e tendÃªncias em eventos infantis."
        canonical="/guia-para-pais"
      />
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sun className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-balance">Guia Completo para Pais</h1>
              <p className="text-xl text-muted-foreground text-balance">
                Insights sobre desenvolvimento infantil, dicas prÃ¡ticas e inspiraÃ§Ã£o para criar momentos inesquecÃ­veis
              </p>
            </div>
          </div>
        </section>
        {/* Desenvolvimento Infantil */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="mb-4">Desenvolvimento Infantil</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Entenda como o brincar impacta positivamente o crescimento das crianÃ§as
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {developmentTopics.map((topic, index) => (
                  <Card key={index} className="hover-lift">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <topic.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {topic.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Dicas para Festa Infantil */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="mb-4">Dicas para Festa Infantil</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Checklist completo para organizar uma celebraÃ§Ã£o segura e memorÃ¡vel
                </p>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Checklist */}
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Checklist Essencial</h3>
                  <div className="space-y-4">
                    {partyChecklist.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                {/* Safety Tips */}
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold">SeguranÃ§a em Primeiro Lugar</h3>
                  </div>
                  <div className="space-y-6">
                    {safetyTips.map((tip, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              {/* Package Selection Tips */}
              <Card className="mt-8 p-8 border-primary/20">
                <h3 className="text-2xl font-bold mb-6">Como Escolher o Pacote Ideal</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Considere:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>â€¢ NÃºmero de crianÃ§as convidadas</li>
                      <li>â€¢ Faixa etÃ¡ria predominante</li>
                      <li>â€¢ DuraÃ§Ã£o desejada do evento</li>
                      <li>â€¢ PreferÃªncias temÃ¡ticas das crianÃ§as</li>
                      <li>â€¢ EspaÃ§o disponÃ­vel (interno/externo)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Vivalegria recomenda:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>â€¢ <strong>Classic</strong>: AtÃ© 15 crianÃ§as, 4 horas</li>
                      <li>â€¢ <strong>Select</strong>: 16-30 crianÃ§as, experiÃªncia completa</li>
                      <li>â€¢ <strong>Oficinas</strong>: Eventos educativos e criativos</li>
                      <li>â€¢ <strong>Corporativo</strong>: Grandes eventos e empresas</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        {/* EducaÃ§Ã£o & Criatividade */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="mb-4">EducaÃ§Ã£o & Criatividade</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  O poder transformador das atividades criativas no desenvolvimento infantil
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {creativityTopics.map((topic, index) => (
                  <Card key={index} className="p-8 hover-lift">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <topic.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="p-8 bg-gradient-subtle border-0">
                <h3 className="text-2xl font-bold mb-6">Como as CrianÃ§as Aprendem Brincando</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">75%</div>
                    <p className="text-sm text-muted-foreground">
                      das crianÃ§as retÃªm melhor informaÃ§Ãµes aprendidas de forma lÃºdica
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">3x</div>
                    <p className="text-sm text-muted-foreground">
                      mais engajamento em atividades prÃ¡ticas comparado a teÃ³ricas
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">90%</div>
                    <p className="text-sm text-muted-foreground">
                      dos pais relatam melhora na criatividade apÃ³s oficinas regulares
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
        {/* Ideias e TendÃªncias */}
        <section className="py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    TendÃªncias 2025
                  </span>
                </div>
                <h2 className="mb-4">Ideias Criativas e Modernas</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Inspire-se com as Ãºltimas tendÃªncias em festas e eventos infantis
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {trendingIdeas.map((idea, index) => (
                  <Card key={index} className="p-6 hover-lift">
                    <h3 className="text-lg font-bold mb-3">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {idea.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* CTA Blocks */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="mb-4">Pronto para Criar MemÃ³rias IncrÃ­veis?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore nossas soluÃ§Ãµes e encontre a perfeita para o seu evento
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-8 text-center hover-lift border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sun className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nossos Pacotes</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Classic, Select e soluÃ§Ãµes personalizadas
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link to="/pacotes">
                      Ver Pacotes
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
                <Card className="p-8 text-center hover-lift border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Oficinas Criativas</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Slime, pintura, cupcakes e muito mais
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <Link to="/oficinas">
                      Conhecer Oficinas
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
                <Card className="p-8 text-center hover-lift border-primary/20">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Contratar Agora</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure seu evento personalizado
                  </p>
                  <Button asChild className="w-full rounded-full shadow-premium">
                    <Link to="/contratar">
                      ComeÃ§ar Agora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              </div>
              {/* WhatsApp CTA */}
              <Card className="mt-8 p-8 bg-gradient-warm text-center border-0">
                <h3 className="text-2xl font-bold mb-4 text-white">Ainda tem dÃºvidas?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Nossa equipe estÃ¡ pronta para ajudar vocÃª a planejar o evento perfeito
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="rounded-full bg-white text-primary hover:bg-white/90 shadow-premium"
                >
                  <a 
                    href="https://wa.me/5511965982251?text=OlÃ¡! Li o Guia para Pais e gostaria de saber mais sobre os serviÃ§os."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Falar no WhatsApp
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default GuiaParaPais;
