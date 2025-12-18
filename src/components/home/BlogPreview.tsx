import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";

import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaSlime from "@/assets/oficina-slime.jpg";
import vivaRecreacao from "@/assets/viva-recreacao.png";

/* ================= BLOG CONTENT ================= */

const blogPosts = [
  {
    title: "10 Brincadeiras que as Crianças Mais Amam em Festas de Aniversário",
    excerpt:
      "Descubra as brincadeiras favoritas das crianças e veja como elas transformam festas infantis em experiências cheias de alegria, interação e boas memórias.",
    image: vivaRecreacao,
    category: "Festas Infantis",
    readTime: "5 min",
    slug: "brincadeiras-festas-aniversario",
  },
  {
    title: "Oficina de Slime: Criatividade, Diversão e Aprendizado",
    excerpt:
      "Entenda por que a oficina de slime é um sucesso entre as crianças e como essa atividade estimula criatividade, coordenação motora e socialização.",
    image: oficinaSlime,
    category: "Oficinas Criativas",
    readTime: "4 min",
    slug: "oficina-slime-criancas",
  },
  {
    title: "Como Escolher a Melhor Recreação Infantil para seu Evento em São Paulo",
    excerpt:
      "Um guia prático para pais e empresas: o que avaliar ao contratar recreação infantil em SP, tipos de serviço, valores e dicas essenciais.",
    image: oficinaPintura,
    category: "Guia para Pais",
    readTime: "7 min",
    slug: "como-escolher-recreacao-sp",
  },
];

/* ================= COMPONENT ================= */

const BlogPreview = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold">VivaBlog</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Conteúdos para Pais que Querem Fazer a Diferença na Festa
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dicas práticas, ideias criativas e orientações de especialistas em recreação infantil
          </p>
        </div>

        {/* POSTS */}
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
                {/* META */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime} de leitura
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* EXCERPT */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Ler o artigo <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                  >
                    <a
                      href="https://wa.me/5511965982251?text=Ol%C3%A1!%20Li%20o%20blog%20da%20Vivalegria%20e%20quero%20informa%C3%A7%C3%B5es%20sobre%20recrea%C3%A7%C3%A3o%20infantil."
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

        {/* FOOTER CTA */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/guia-para-pais" className="flex items-center gap-2">
              Acessar o Guia Completo para Pais
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
