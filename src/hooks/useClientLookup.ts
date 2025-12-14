import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { unmask } from "@/utils/inputMasks";

interface ClienteData {
  id: string;
  cpf_cnpj: string;
  tipo_cadastro: string;
  nome_completo: string;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  endereco: string | null;
  complemento: string | null;
  cidade: string | null;
}

interface LookupResult {
  found: boolean;
  cliente?: ClienteData;
}

export const useClientLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clienteExistente, setClienteExistente] = useState<ClienteData | null>(null);

  const lookupClient = useCallback(async (cpfCnpj: string): Promise<LookupResult> => {
    const unmaskedCpfCnpj = unmask(cpfCnpj);
    
    if (unmaskedCpfCnpj.length < 11) {
      return { found: false };
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc("lookup_cliente_by_cpf_cnpj", {
        p_cpf_cnpj: unmaskedCpfCnpj,
      });

      if (error) {
        console.error("Erro ao buscar cliente:", error);
        return { found: false };
      }

      const result = data as unknown as LookupResult;
      
      if (result.found && result.cliente) {
        setClienteExistente(result.cliente);
        return result;
      }
      
      setClienteExistente(null);
      return { found: false };
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
      return { found: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCliente = useCallback(() => {
    setClienteExistente(null);
  }, []);

  return {
    lookupClient,
    clearCliente,
    clienteExistente,
    isLoading,
  };
};
