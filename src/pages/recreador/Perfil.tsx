import { useQuery } from "@tanstack/react-query";
import { User, Phone, Mail, MapPin, Award, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import RecreadorLayout from "@/components/recreador/RecreadorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecreadorPerfil = () => {
  const { profissionalId, user } = useAuth();

  // Fetch perfil do profissional
  const { data: perfil, isLoading } = useQuery({
    queryKey: ['meu-perfil', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return null;
      
      const { data, error } = await supabase
        .from('profissionais')
        .select('*')
        .eq('id', profissionalId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!profissionalId,
  });

  // Fetch estatísticas
  const { data: stats } = useQuery({
    queryKey: ['meu-perfil-stats', profissionalId],
    queryFn: async () => {
      if (!profissionalId) return { eventos: 0, totalGanho: 0 };
      
      const { data, error } = await supabase
        .from('evento_casting')
        .select('cache, pago')
        .eq('profissional_id', profissionalId);
      
      if (error) throw error;
      
      const eventos = data?.length || 0;
      const totalGanho = data?.reduce((acc, curr) => acc + (curr.cache || 0), 0) || 0;
      
      return { eventos, totalGanho };
    },
    enabled: !!profissionalId,
  });

  if (isLoading) {
    return (
      <RecreadorLayout>
        <div className="text-center py-8">Carregando...</div>
      </RecreadorLayout>
    );
  }

  return (
    <RecreadorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Suas informações cadastrais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados Principais */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Informações do seu cadastro (somente leitura)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nome Completo
                  </label>
                  <p className="text-lg">{perfil?.nome_completo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Apelido
                  </label>
                  <p className="text-lg">{perfil?.apelido || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Registro
                  </label>
                  <p className="text-lg">{perfil?.registro || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    CPF
                  </label>
                  <p className="text-lg">{perfil?.cpf || "-"}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{perfil?.telefone || "Não informado"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{perfil?.email || user?.email || "Não informado"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{perfil?.endereco || "Não informado"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Eventos</p>
                  <p className="text-2xl font-bold">{stats?.eventos || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ganho</p>
                  <p className="text-2xl font-bold">
                    R$ {(stats?.totalGanho || 0).toLocaleString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cadastro</span>
                  <Badge variant={perfil?.status === 'ativo' ? 'default' : 'secondary'}>
                    {perfil?.status || 'Pendente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tem CNPJ</span>
                  <Badge variant={perfil?.tem_cnpj ? 'default' : 'outline'}>
                    {perfil?.tem_cnpj ? 'Sim' : 'Não'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Habilidades */}
        {perfil?.habilidades && Object.keys(perfil.habilidades).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Habilidades</CardTitle>
              <CardDescription>
                Suas competências cadastradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(perfil.habilidades as Record<string, number>).map(
                  ([hab, nivel]) => (
                    <Badge key={hab} variant="outline" className="text-sm">
                      {hab} ({nivel}/5)
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Para atualizar seus dados, entre em contato com a administração.
        </p>
      </div>
    </RecreadorLayout>
  );
};

export default RecreadorPerfil;
