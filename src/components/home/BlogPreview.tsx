import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";

import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaSlime from "@/assets/oficina-slime.jpg";
import vivaRecreacao from "@/assets/viva-recreacao.png";

const blogPosts = [
  {
    title: "10 Brincadeiras que as Crianças Amam em Festas de Aniversário",
    excerpt:
      "Descubra as atividades mais pedidas e como elas transformam qualquer festa em um momento inesquecível para os pequenos.",
    image: vivaRecreacao,
    category: "Dicas de Festas",
    readTime: "5 min",
    slug: "brincadeiras-festas-aniversario",
  },
  {
    title: "Oficina de Slime: Por Que as Crianças São Obcecadas?",
    excerpt:
      "Entenda a ciência por trás do slime e como essa oficina criativa estimula a coordenação e a criatividade infantil.",
    image: oficinaSlime,
    category: "Oficinas Criativas",
    readTime: "4 min",
    slug: "oficina-slime-criancas",
  },
  {
    title: "Como Escolher a Recreação Ideal para seu Evento em SP",
    excerpt:
      "Guia completo para contratar recreação infantil em São Paulo: o que avaliar, preços e dicas importantes.",
    image: oficinaPintura,
    category: "Guia do Cliente",
    readTime: "7 min",
    slug: "como-escolher-recreacao-sp",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold">VivaBlog</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Dicas e Inspirações para sua Festa
          </h2>

          <p className="text-xl text-muted-foreground">
            Conteúdos exclusivos para pais e organizadores de eventos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-hover"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} de leitura
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                  >
                    <a
                      href="https://wa.me/5511965982251?text=Ol%C3%A1!%20Vi%20o%20blog%20e%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20recrea%C3%A7%C3%A3o%20infantil."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/guia-para-pais" className="flex items-center gap-2">
              Ver todos os artigos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
