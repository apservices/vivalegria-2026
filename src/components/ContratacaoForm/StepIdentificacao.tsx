import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maskCPF, maskCNPJ } from "@/utils/inputMasks";
import { StepProps, TipoCliente, TipoCadastro } from "./types";
import { User, Building2 } from "lucide-react";

export const StepIdentificacao = ({ formData, updateFormData, errors }: StepProps) => {
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = formData.tipoCadastro === 'pf' ? maskCPF(value) : maskCNPJ(value);
    updateFormData({ cpfCnpj: masked });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Identificação</h2>
        <p className="text-muted-foreground">Informe seus dados de identificação</p>
      </div>

      {/* Tipo de Cliente */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Você é cliente?</Label>
        <RadioGroup
          value={formData.tipoCliente}
          onValueChange={(value: TipoCliente) => updateFormData({ tipoCliente: value })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existente" id="existente" />
            <Label htmlFor="existente" className="cursor-pointer">Cliente existente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="novo" id="novo" />
            <Label htmlFor="novo" className="cursor-pointer">Novo cliente</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Tipo de Cadastro */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Tipo de cadastro</Label>
        <Select
          value={formData.tipoCadastro}
          onValueChange={(value: TipoCadastro) => {
            updateFormData({ tipoCadastro: value, cpfCnpj: '' });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo de cadastro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pf">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Pessoa Física (CPF)</span>
              </div>
            </SelectItem>
            <SelectItem value="pj">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Pessoa Jurídica (CNPJ)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CPF ou CNPJ */}
      <div className="space-y-3">
        <Label htmlFor="cpfCnpj" className="text-base font-medium">
          {formData.tipoCadastro === 'pf' ? 'CPF' : 'CNPJ'}
        </Label>
        <Input
          id="cpfCnpj"
          type="text"
          value={formData.cpfCnpj}
          onChange={handleCpfCnpjChange}
          placeholder={formData.tipoCadastro === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
          className={errors.cpfCnpj ? 'border-destructive' : ''}
        />
        {errors.cpfCnpj && (
          <p className="text-sm text-destructive">{errors.cpfCnpj}</p>
        )}
      </div>
    </div>
  );
};
