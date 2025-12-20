import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { trackFormSubmit, trackWhatsAppClick } from "@/utils/tracking";

const Contato = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do formulário.",
        variant: "destructive",
      });
      return;
    }

    // Send to WhatsApp
    const message = `*Novo Contato - Vivalegria*\n\n*Nome:* ${formData.name}\n*Email:* ${formData.email}\n*Telefone:* ${formData.phone}\n*Tipo de Evento:* ${formData.eventType}\n*Mensagem:* ${formData.message}`;
    const whatsappUrl = `https://wa.me/5511965982251?text=${encodeURIComponent(message)}`;
    
    // Track form submission and WhatsApp click (respects consent)
    trackFormSubmit('contato');
    trackWhatsAppClick('form');
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    toast({
      title: "Mensagem enviada!",
      description: "Em breve entraremos em contato com você.",
    });

    // Reset form
    setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <SEO
        title="Contato | Vivalegria Recreação"
        description="Entre em contato com a Vivalegria. Atendemos São Paulo e região metropolitana (incluindo ABC Paulista)."
        canonical="/contato"
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-balance">Fale Conosco</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Entre em contato e vamos planejar juntos o evento dos sonhos.
            </p>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="p-6 hover-lift">
                  <div className="flex items-start">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Telefone / WhatsApp</h3>
                      <a
                        href="https://wa.me/5511965982251"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        (11) 96598-2251
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover-lift">
                  <div className="flex items-start">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">E-mail</h3>
                      <a
                        href="mailto:contato@vivalegria.com.br"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        contato@vivalegria.com.br
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover-lift">
                  <div className="flex items-start">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Endereço</h3>
                      <p className="text-muted-foreground">São Paulo - SP</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 hover-lift">
                  <div className="flex items-start">
                    <div className="p-3 bg-primary/10 rounded-lg mr-4">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Horário de Atendimento</h3>
                      <p className="text-muted-foreground">
                        Seg a Sex: 9h às 18h
                        <br />
                        Sáb: 9h às 12h
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Seu nome"
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
                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="eventType">Tipo de evento</Label>
                        <Input
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          placeholder="Ex: Aniversário, Casamento, Corporativo..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Conte-nos sobre seu evento, data, número de crianças, bairro/cidade, etc."
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full rounded-full shadow-premium">
                      <Send className="mr-2 w-5 h-5" />
                      Enviar mensagem
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Nossa Localização</h2>
              <p className="text-lg text-muted-foreground">
                Atendemos São Paulo e região. Consulte disponibilidade e deslocamento.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-soft">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467689.8895679627!2d-46.87511934999999!3d-23.6824124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1702000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Vivalegria - São Paulo"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contato;
