import { MapPin, Phone, Mail, Clock } from "lucide-react";
const MapSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Atendemos SÃ£o Paulo e RegiÃ£o
          </h2>
          <p className="text-xl text-muted-foreground">
            Vila Mariana, Moema, Brooklin, TatuapÃ©, ABC Paulista e toda Grande SÃ£o Paulo
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map Embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467689.8895679627!2d-46.87511934999999!3d-23.6824124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce448183a461d1%3A0x9ba94b08ff335bae!2sS%C3%A3o%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1702000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LocalizaÃ§Ã£o Vivalegria - SÃ£o Paulo"
            />
          </div>
          {/* Contact Info */}
          <div className="bg-muted rounded-2xl p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Vivalegria RecreaÃ§Ã£o Infantil</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">EndereÃ§o</h4>
                  <p className="text-muted-foreground">
                    SÃ£o Paulo - SP, Brasil<br />
                    Atendimento em toda Grande SÃ£o Paulo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Phone className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">WhatsApp</h4>
                  <a
                    href="https://wa.me/5511965982251"
                    className="text-primary hover:underline font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    (11) 96598-2251
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">E-mail</h4>
                  <a
                    href="mailto:contato@vivalegria.com.br"
                    className="text-primary hover:underline"
                  >
                    contato@vivalegria.com.br
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">HorÃ¡rio de Atendimento</h4>
                  <p className="text-muted-foreground">
                    Segunda a Sexta: 9h Ã s 18h<br />
                    SÃ¡bado: 9h Ã s 12h
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-primary/10 rounded-xl">
              <p className="text-sm text-center">
                <strong className="text-primary">Eventos aos finais de semana e feriados!</strong><br />
                Consulte disponibilidade pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default MapSection;
