import { useState } from "react";
import { Heart, Users, Clock, Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { maskPhone } from "@/utils/inputMasks";

const TrabalheConosco = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    cidade: "",
    experiencia: "",
    sobre_voce: "",
  });
  const [disponibilidade, setDisponibilidade] = useState<string[]>([]);

  const benefits = [
    { icon: Heart, title: "Ambiente Alegre", description: "Trabalhe em um ambiente descontraÃ­do e cheio de energia positiva" },
    { icon: Users, title: "Equipe Unida", description: "FaÃ§a parte de uma equipe colaborativa e apaixonada pelo que faz" },
    { icon: Clock, title: "Flexibilidade", description: "HorÃ¡rios flexÃ­veis que se adaptam Ã  sua rotina" },
    { icon: Star, title: "Crescimento", description: "Oportunidades de desenvolvimento profissional e treinamentos" },
  ];

  const disponibilidadeOptions = [
    { value: "fins_semana", label: "Finais de semana" },
    { value: "feriados", label: "Feriados" },
    { value: "eventos_escolares", label: "Eventos escolares (dias Ãºteis)" },
    { value: "eventos_corporativos", label: "Eventos corporativos" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setFormData(prev => ({ ...prev, [name]: maskPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleDisponibilidade = (value: string) => {
    setDisponibilidade(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_completo || !formData.email || !formData.telefone || !formData.cidade) {
      toast({
        title: "Campos obrigatÃ³rios",
        description: "Por favor, preencha todos os campos obrigatÃ³rios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("candidaturas").insert({
        nome_completo: formData.nome_completo,
        email: formData.email,
        telefone: formData.telefone,
        cidade: formData.cidade,
        experiencia: formData.experiencia || null,
        disponibilidade: disponibilidade.length > 0 ? disponibilidade : null,
        sobre_voce: formData.sobre_voce || null,
      });

      if (error) throw error;

      toast({
        title: "Candidatura enviada!",
        description: "Recebemos sua candidatura. Entraremos em contato em breve!",
      });

      setFormData({
        nome_completo: "",
        email: "",
        telefone: "",
        cidade: "",
        experiencia: "",
        sobre_voce: "",
      });
      setDisponibilidade([]);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Trabalhe Conosco | Vivalegria RecreaÃ§Ã£o"
        description="FaÃ§a parte da equipe Vivalegria! Vagas para recreadores e monitores de eventos infantis em SÃ£o Paulo."
        canonical="/trabalhe-conosco"
      />
      <div className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-[#FFD836]/20 via-white to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Trabalhe Conosco</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Venha fazer parte da equipe que transforma festas em momentos mÃ¡gicos!
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Por que trabalhar na Vivalegria?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#FFD836]/20 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-7 h-7 text-[#FF731D]" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-[#FFF8E6]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">O que buscamos</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#FF731D]">Perfil desejado</h3>
                  <ul className="space-y-3">
                    {[
                      "PaixÃ£o por trabalhar com crianÃ§as",
                      "Energia e disposiÃ§Ã£o para eventos",
                      "Boa comunicaÃ§Ã£o e simpatia",
                      "Responsabilidade e pontualidade",
                      "Criatividade e proatividade",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF731D] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#FF731D]">Diferenciais</h3>
                  <ul className="space-y-3">
                    {[
                      "ExperiÃªncia com recreaÃ§Ã£o infantil",
                      "FormaÃ§Ã£o em Pedagogia, EducaÃ§Ã£o FÃ­sica ou Ã¡reas afins",
                      "Conhecimento em oficinas criativas",
                      "Disponibilidade para finais de semana",
                      "VeÃ­culo prÃ³prio",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FFD836] mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Envie sua candidatura</h2>
              <p className="text-center text-muted-foreground mb-8">
                Preencha o formulÃ¡rio abaixo e entraremos em contato!
              </p>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome_completo">Nome completo *</Label>
                      <Input
                        id="nome_completo"
                        name="nome_completo"
                        value={formData.nome_completo}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="SÃ£o Paulo - SP"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Disponibilidade</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {disponibilidadeOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={disponibilidade.includes(option.value)}
                            onCheckedChange={() => toggleDisponibilidade(option.value)}
                          />
                          <label htmlFor={option.value} className="text-sm cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experiencia">ExperiÃªncia com crianÃ§as</Label>
                    <Textarea
                      id="experiencia"
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleChange}
                      placeholder="Conte sobre sua experiÃªncia trabalhando com crianÃ§as..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sobre_voce">Sobre vocÃª</Label>
                    <Textarea
                      id="sobre_voce"
                      name="sobre_voce"
                      value={formData.sobre_voce}
                      onChange={handleChange}
                      placeholder="Por que vocÃª quer trabalhar na Vivalegria?"
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="mr-2 w-5 h-5" />
                        Enviar candidatura
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TrabalheConosco;