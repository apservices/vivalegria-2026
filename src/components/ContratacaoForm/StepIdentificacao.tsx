import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { maskCPF, maskCNPJ, maskPhone, maskCEP, unmask } from "@/utils/inputMasks";
import { StepProps, TipoCadastro } from "./types";
import { User, Building2, CheckCircle, Loader2 } from "lucide-react";
import { useClientLookup } from "@/hooks/useClientLookup";

export const StepIdentificacao = ({ formData, updateFormData, errors }: StepProps) => {
  const { lookupClient, clienteExistente, isLoading, clearCliente } = useClientLookup();
  const [hasSearched, setHasSearched] = useState(false);

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const masked = formData.tipoCadastro === 'pf' ? maskCPF(value) : maskCNPJ(value);
    updateFormData({ cpfCnpj: masked });
    
    // Reset cliente existente quando digitar novo valor
    if (clienteExistente) {
      clearCliente();
      setHasSearched(false);
    }
  };

  // Debounced search when CPF/CNPJ is complete
  const performSearch = useCallback(async () => {
    const unmasked = unmask(formData.cpfCnpj);
    const expectedLength = formData.tipoCadastro === 'pf' ? 11 : 14;
    
    if (unmasked.length === expectedLength && !hasSearched) {
      setHasSearched(true);
      const result = await lookupClient(formData.cpfCnpj);
      
      if (result.found && result.cliente) {
        // Auto-fill form data
        updateFormData({
          tipoCliente: 'existente',
          nomeCompleto: result.cliente.nome_completo || '',
          telefone: result.cliente.telefone ? maskPhone(result.cliente.telefone) : '',
          email: result.cliente.email || '',
          emailConfirmacao: result.cliente.email || '',
          cep: result.cliente.cep ? maskCEP(result.cliente.cep) : '',
          endereco: result.cliente.endereco || '',
          complemento: result.cliente.complemento || '',
          cidade: result.cliente.cidade || '',
        });
      }
    }
  }, [formData.cpfCnpj, formData.tipoCadastro, hasSearched, lookupClient, updateFormData]);

  useEffect(() => {
    const unmasked = unmask(formData.cpfCnpj);
    const expectedLength = formData.tipoCadastro === 'pf' ? 11 : 14;
    
    if (unmasked.length === expectedLength && !hasSearched) {
      const timer = setTimeout(performSearch, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.cpfCnpj, formData.tipoCadastro, hasSearched, performSearch]);

  const handleTipoCadastroChange = (value: TipoCadastro) => {
    updateFormData({ tipoCadastro: value, cpfCnpj: '' });
    clearCliente();
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Identificação</h2>
        <p className="text-muted-foreground">Informe seus dados de identificação</p>
      </div>

      {/* Tipo de Cadastro */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Tipo de cadastro</Label>
        <Select
          value={formData.tipoCadastro}
          onValueChange={handleTipoCadastroChange}
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
        <div className="relative">
          <Input
            id="cpfCnpj"
            type="text"
            value={formData.cpfCnpj}
            onChange={handleCpfCnpjChange}
            placeholder={formData.tipoCadastro === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
            className={errors.cpfCnpj ? 'border-destructive' : ''}
            disabled={!!clienteExistente}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {errors.cpfCnpj && (
          <p className="text-sm text-destructive">{errors.cpfCnpj}</p>
        )}
      </div>

      {/* Mensagem de Cliente Existente */}
      {clienteExistente && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <strong>Olá de novo! 👋</strong>
            <br />
            Identificamos que você já possui cadastro. Seus dados foram preenchidos automaticamente.
            Confirme apenas os dados do evento na próxima etapa.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
