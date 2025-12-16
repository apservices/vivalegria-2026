export type TipoCliente = 'existente' | 'novo';
export type TipoCadastro = 'pf' | 'pj';
export type TipoEspaco = 'aberto' | 'fechado' | 'misto';
export type FaixaEtaria = '0-3' | '4-6' | '7-10' | 'misto';

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
  // Campos de Negócio (BLOCO 3.2)
  enderecoResidencial: string;
  enderecoEventoCompleto: string;
  tipoEspaco: TipoEspaco | '';
  faixaEtaria: FaixaEtaria | '';
  observacoesEvento: string;
}

export interface StepProps {
  formData: ContratacaoFormData;
  updateFormData: (data: Partial<ContratacaoFormData>) => void;
  errors: Partial<Record<keyof ContratacaoFormData, string>>;
}
