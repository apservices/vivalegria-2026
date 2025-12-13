export type TipoCliente = 'existente' | 'novo';
export type TipoCadastro = 'pf' | 'pj';
export interface ContratacaoFormData {
  // Etapa 1: Identificação
  tipoCliente: TipoCliente;
  tipoCadastro: TipoCadastro;
  cpfCnpj: string;
  // Etapa 2: Dados do Contratante
  nomeCompleto: string;
  telefone: string;
  email: string;
  emailConfirmacao: string;
  cep: string;
  endereco: string;
  complemento: string;
  cidade: string;
  // Etapa 3: Dados do Evento
  dataEvento: string;
  horaInicio: string;
  localEvento: string;
}
export interface StepProps {
  formData: ContratacaoFormData;
  updateFormData: (data: Partial<ContratacaoFormData>) => void;
  errors: Partial<Record<keyof ContratacaoFormData, string>>;
}
