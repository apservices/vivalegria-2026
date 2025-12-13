import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}
export const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          return (
            <div key={index} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-viva-orange text-white",
                    isCurrent && "bg-viva-orange text-white ring-4 ring-viva-orange/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center hidden sm:block",
                    (isCompleted || isCurrent) ? "text-viva-orange" : "text-muted-foreground"
                  )}
                >
                  {stepLabels[index]}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 rounded-full transition-all duration-300",
                    isCompleted ? "bg-viva-orange" : "bg-muted"
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
