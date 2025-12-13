import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { StepProps } from "./types";
import { Calendar, Clock, MapPin, Package } from "lucide-react";

export const StepDadosEvento = ({ formData, updateFormData, errors }: StepProps) => {
  const { packageType, numChildren, selectedWorkshops, selectedExtras, calculateTotal } = useConfigurator();
  const total = calculateTotal();

  const packageNames: Record<string, string> = {
    classic: 'Classic',
    select: 'Select',
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dados do Evento</h2>
        <p className="text-muted-foreground">Informe os detalhes do seu evento</p>
      </div>

      {/* Resumo do Pacote Selecionado */}
      <div className="bg-viva-yellow/10 border border-viva-yellow/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-viva-orange font-semibold">
          <Package className="h-5 w-5" />
          <span>Resumo do Pacote</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Pacote:</span>
            <span className="ml-2 font-medium">{packageType ? packageNames[packageType] : 'Não selecionado'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Crianças:</span>
            <span className="ml-2 font-medium">{numChildren}</span>
          </div>
        </div>
        {selectedWorkshops.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Oficinas:</span>
            <span className="ml-2 font-medium">{selectedWorkshops.join(', ')}</span>
          </div>
        )}
        {selectedExtras.length > 0 && (
          <div className="text-sm">
            <span className="text-muted-foreground">Extras:</span>
            <span className="ml-2 font-medium">{selectedExtras.join(', ')}</span>
          </div>
        )}
        <div className="pt-2 border-t border-viva-yellow/30">
          <span className="text-lg font-bold text-viva-orange">
            Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Data do Evento */}
      <div className="space-y-2">
        <Label htmlFor="dataEvento" className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-viva-orange" />
          Data do Evento *
        </Label>
        <Input
          id="dataEvento"
          type="date"
          value={formData.dataEvento}
          onChange={(e) => updateFormData({ dataEvento: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className={errors.dataEvento ? 'border-destructive' : ''}
        />
        {errors.dataEvento && (
          <p className="text-sm text-destructive">{errors.dataEvento}</p>
        )}
      </div>

      {/* Hora de Início */}
      <div className="space-y-2">
        <Label htmlFor="horaInicio" className="text-base font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-viva-orange" />
          Hora de Início *
        </Label>
        <Input
          id="horaInicio"
          type="time"
          value={formData.horaInicio}
          onChange={(e) => updateFormData({ horaInicio: e.target.value })}
          className={errors.horaInicio ? 'border-destructive' : ''}
        />
        {errors.horaInicio && (
          <p className="text-sm text-destructive">{errors.horaInicio}</p>
        )}
      </div>

      {/* Local do Evento */}
      <div className="space-y-2">
        <Label htmlFor="localEvento" className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-viva-orange" />
          Local do Evento *
        </Label>
        <Textarea
          id="localEvento"
          value={formData.localEvento}
          onChange={(e) => updateFormData({ localEvento: e.target.value })}
          placeholder="Endereço completo onde será realizado o evento"
          rows={3}
          className={errors.localEvento ? 'border-destructive' : ''}
        />
        {errors.localEvento && (
          <p className="text-sm text-destructive">{errors.localEvento}</p>
        )}
      </div>
    </div>
  );
};
