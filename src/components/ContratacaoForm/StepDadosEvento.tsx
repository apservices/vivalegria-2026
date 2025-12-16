import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfigurator } from "@/contexts/ConfiguratorContext";
import { StepProps, TipoEspaco, FaixaEtaria } from "./types";
import { Calendar, Clock, MapPin, Package, Home, Users, AlertCircle } from "lucide-react";

const tipoEspacoOptions: { value: TipoEspaco; label: string }[] = [
  { value: "aberto", label: "Espaço Aberto (área externa, quintal, parque)" },
  { value: "fechado", label: "Espaço Fechado (salão, apartamento, buffet)" },
  { value: "misto", label: "Misto (área coberta + externa)" },
];

const faixaEtariaOptions: { value: FaixaEtaria; label: string }[] = [
  { value: "0-3", label: "0 a 3 anos (bebês)" },
  { value: "4-6", label: "4 a 6 anos" },
  { value: "7-10", label: "7 a 10 anos" },
  { value: "misto", label: "Misto (várias idades)" },
];

export const StepDadosEvento = ({ formData, updateFormData, errors }: StepProps) => {
  const { packageType, numChildren, selectedWorkshops, selectedExtras, calculateTotal } = useConfigurator();
  const total = calculateTotal();

  const packageNames: Record<string, string> = {
    classic: 'Clássico',
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

      {/* Tipo de Espaço */}
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Home className="h-4 w-4 text-viva-orange" />
          Tipo de Espaço *
        </Label>
        <Select
          value={formData.tipoEspaco}
          onValueChange={(value: TipoEspaco) => updateFormData({ tipoEspaco: value })}
        >
          <SelectTrigger className={errors.tipoEspaco ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecione o tipo de espaço" />
          </SelectTrigger>
          <SelectContent>
            {tipoEspacoOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoEspaco && (
          <p className="text-sm text-destructive">{errors.tipoEspaco}</p>
        )}
      </div>

      {/* Faixa Etária */}
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-viva-orange" />
          Faixa Etária das Crianças *
        </Label>
        <Select
          value={formData.faixaEtaria}
          onValueChange={(value: FaixaEtaria) => updateFormData({ faixaEtaria: value })}
        >
          <SelectTrigger className={errors.faixaEtaria ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecione a faixa etária" />
          </SelectTrigger>
          <SelectContent>
            {faixaEtariaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.faixaEtaria && (
          <p className="text-sm text-destructive">{errors.faixaEtaria}</p>
        )}
      </div>

      {/* Endereço Residencial */}
      <div className="space-y-2">
        <Label htmlFor="enderecoResidencial" className="text-base font-medium flex items-center gap-2">
          <Home className="h-4 w-4 text-viva-orange" />
          Endereço Residencial
        </Label>
        <Input
          id="enderecoResidencial"
          value={formData.enderecoResidencial}
          onChange={(e) => updateFormData({ enderecoResidencial: e.target.value })}
          placeholder="Seu endereço residencial (se diferente do evento)"
        />
        <p className="text-xs text-muted-foreground">
          Opcional. Preencha se diferente do local do evento.
        </p>
      </div>

      {/* Endereço Completo do Evento */}
      <div className="space-y-2">
        <Label htmlFor="enderecoEventoCompleto" className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-viva-orange" />
          Endereço Completo do Evento *
        </Label>
        <Textarea
          id="enderecoEventoCompleto"
          value={formData.enderecoEventoCompleto}
          onChange={(e) => updateFormData({ enderecoEventoCompleto: e.target.value })}
          placeholder="Rua, número, bairro, cidade, CEP, ponto de referência"
          rows={2}
          className={errors.enderecoEventoCompleto ? 'border-destructive' : ''}
        />
        {errors.enderecoEventoCompleto && (
          <p className="text-sm text-destructive">{errors.enderecoEventoCompleto}</p>
        )}
      </div>

      {/* Local do Evento (nome do espaço) */}
      <div className="space-y-2">
        <Label htmlFor="localEvento" className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-viva-orange" />
          Nome do Local *
        </Label>
        <Input
          id="localEvento"
          value={formData.localEvento}
          onChange={(e) => updateFormData({ localEvento: e.target.value })}
          placeholder="Ex: Salão de Festas do Condomínio, Buffet Kids, Minha Casa"
          className={errors.localEvento ? 'border-destructive' : ''}
        />
        {errors.localEvento && (
          <p className="text-sm text-destructive">{errors.localEvento}</p>
        )}
      </div>

      {/* Observações do Evento */}
      <div className="space-y-2">
        <Label htmlFor="observacoesEvento" className="text-base font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-viva-orange" />
          Observações Importantes
        </Label>
        <Textarea
          id="observacoesEvento"
          value={formData.observacoesEvento}
          onChange={(e) => updateFormData({ observacoesEvento: e.target.value })}
          placeholder="Informe alergias, regras do local, necessidades especiais, restrições, tema da festa, etc."
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Opcional. Informações que ajudem nossa equipe a preparar o evento.
        </p>
      </div>
    </div>
  );
};
