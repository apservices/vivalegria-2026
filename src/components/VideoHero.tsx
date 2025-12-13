import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface VideoHeroProps {
  videoUrl?: string;
}

const VideoHero = ({
  videoUrl = "/videos/hero-vivalegria.mp4",
}: VideoHeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          
          {/* Premium Title – 2 lines */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
            Transforme seu evento
            <br />
            <span className="text-[#FFD836] font-extrabold">
              em um momento mágico
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Recreação infantil com alegria, segurança e profissionalismo.
            <br />
            Experiências inesquecíveis para toda a família.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full text-lg px-10 h-14 bg-[#FF731D] hover:bg-[#FF4E17] text-white border-0 shadow-lg"
            >
              <Link to="/contratar">Planejar meu evento</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full text-lg px-10 h-14 border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#FF731D]"
            >
              <Link to="/pacotes">Ver pacotes</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
