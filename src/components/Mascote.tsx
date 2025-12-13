import { cn } from "@/lib/utils";

type MascotePose = "hero" | "cadastro" | "sucesso" | "banner" | "pintura" | "slime";
type MascoteAnimation = "fadeIn" | "pulinho" | "balanco" | "none";

const poseDescriptions: Record<MascotePose, string> = {
  hero: "em pose de vitória",
  cadastro: "segurando telefone",
  sucesso: "pulando de alegria",
  banner: "apontando para o banner",
  pintura: "com pincel de pintura",
  slime: "fazendo slime colorido",
};

const animationClasses: Record<MascoteAnimation, string> = {
  fadeIn: "animate-mascote-fade",
  pulinho: "animate-mascote-pulinho",
  balanco: "animate-mascote-balanco",
  none: "",
};

interface MascoteProps {
  pose: MascotePose;
  animation?: MascoteAnimation;
  className?: string;
}

const Mascote = ({ pose, animation = "none", className }: MascoteProps) => {
  const altText = `Mascote Solzinho Vivalegria ${poseDescriptions[pose]}`;
  const animationClass = animationClasses[animation];
  const src = `/assets/mascote/mascote-${pose}.png`;

  return (
    <img
      src={src}
      alt={altText}
      loading="lazy"
      className={cn(
        "pointer-events-none select-none drop-shadow-xl",
        animationClass,
        className,
      )}
    />
  );
};

export default Mascote;
