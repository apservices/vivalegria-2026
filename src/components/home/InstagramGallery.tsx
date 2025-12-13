import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assets
import vivaSlime from "@/assets/viva-slime.png";
import vivaRecreacao from "@/assets/viva-recreacao.png";
import vivaPintura from "@/assets/viva-pintura.png";
import vivaEquipe from "@/assets/viva-equipe.png";
import oficinaPintura from "@/assets/oficina-pintura.jpg";
import oficinaSlime from "@/assets/oficina-slime.jpg";

const images = [
  { src: vivaSlime, alt: "Oficina de Slime Vivalegria SP" },
  { src: vivaRecreacao, alt: "Recreação infantil em festa de aniversário" },
  { src: vivaPintura, alt: "Pintura em tela para festa infantil" },
  { src: vivaEquipe, alt: "Equipe Vivalegria de recreadores" },
  { src: oficinaPintura, alt: "Oficina de pintura artística para crianças" },
  { src: oficinaSlime, alt: "Slime colorido em festa infantil" },
];

const InstagramGallery = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white rounded-full px-4 py-2 mb-4">
            <Instagram className="w-5 h-5" />
            <span className="text-sm font-semibold">@vivalegria_</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Destaques no Instagram
          </h2>

          <p className="text-xl text-muted-foreground">
            Veja a alegria dos nossos eventos! 📸
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-10">
          {images.map((image, index) => (
            <a
              key={index}
              href="https://www.instagram.com/vivalegria_/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full text-lg px-8 h-14 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90"
          >
            <a
              href="https://www.instagram.com/vivalegria_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Siga @vivalegria_ no Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
