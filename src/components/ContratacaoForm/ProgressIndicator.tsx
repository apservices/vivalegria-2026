import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLastStep = index === totalSteps - 1;

          return (
            <div
              key={index}
              // Ajuste: O último item é 'flex-none' para não esticar além do necessário,
              // enquanto os outros são 'flex-1' para esticar a linha de conexão.
              className={cn(
                "flex items-center",
                isLastStep ? "flex-none" : "flex-1"
              )}
            >
              <div className="flex flex-col items-center relative group">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                    isCompleted
                      ? "bg-viva-orange border-viva-orange text-white"
                      : isCurrent
                      ? "bg-viva-orange border-viva-orange text-white ring-4 ring-viva-orange/20"
                      : "bg-background border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "absolute top-12 whitespace-nowrap text-xs font-medium transition-colors duration-300 hidden sm:block",
                    isCompleted || isCurrent
                      ? "text-viva-orange"
                      : "text-muted-foreground"
                  )}
                >
                  {stepLabels[index]}
                </span>
              </div>

              {/* Linha de conexão (renderizada apenas se não for o último item) */}
              {!isLastStep && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-4 rounded-full transition-all duration-500",
                    isCompleted ? "bg-viva-orange" : "bg-muted/50"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
