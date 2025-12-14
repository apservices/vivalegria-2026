import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Eye, Search, Calendar, Copy, Link2, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";

interface Avaliacao {
  id: string;
  reserva_id: string | null;
  profissional_id: string | null;
  profissional_nome: string | null;
  respostas: Record<string, any>;
  observacoes_admin: string | null;
  created_at: string;
  reservas?: {
    nome_completo: string;
    data_evento: string;
  } | null;
}

interface PesquisaCliente {
  id: string;
  reserva_id: string | null;
  token: string;
  respostas: Record<string, any>;
  created_at: string;
  reservas?: {
    nome_completo: string;
    data_evento: string;
  } | null;
}

interface TokenPesquisa {
  token: string;
  reserva_id: string;
  is_active: boolean;
  used_at: string | null;
  created_at: string;
  reservas?: {
    nome_completo: string;
    data_evento: string;
  } | null;
}

const AdminAvaliacoes = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pesquisas, setPesquisas] = useState<PesquisaCliente[]>([]);
  const [tokens, setTokens] = useState<TokenPesquisa[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<Avaliacao | null>(null);
  const [selectedPesquisa, setSelectedPesquisa] = useState<PesquisaCliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservaForToken, setSelectedReservaForToken] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [avaliacoesRes, pesquisasRes, tokensRes, reservasRes] = await Promise.all([
        supabase
          .from("avaliacoes_evento")
          .select("*, reservas(nome_completo, data_evento)")
          .order("created_at", { ascending: false }),
        supabase
          .from("pesquisas_clientes")
          .select("*, reservas(nome_completo, data_evento)")
          .order("created_at", { ascending: false }),
        supabase
          .from("tokens_pesquisa")
          .select("*, reservas(nome_completo, data_evento)")
          .order("created_at", { ascending: false }),
        supabase
          .from("reservas")
          .select("id, nome_completo, data_evento")
          .order("data_evento", { ascending: false })
          .limit(100),
      ]);

      setAvaliacoes((avaliacoesRes.data || []) as Avaliacao[]);
      setPesquisas((pesquisasRes.data || []) as PesquisaCliente[]);
      setTokens((tokensRes.data || []) as TokenPesquisa[]);
      setReservas(reservasRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const generateToken = async () => {
    if (!selectedReservaForToken) {
      toast({
        title: "Selecione uma reserva",
        variant: "destructive",
      });
      return;
    }

    setGeneratingToken(true);
    try {
      const { data, error } = await supabase.rpc("generate_satisfaction_token", {
        p_reserva_id: selectedReservaForToken,
      });

      if (error) throw error;

      const newToken = data as string;
      const link = `${window.location.origin}/pesquisa-satisfacao?token=${newToken}`;
      
      await navigator.clipboard.writeText(link);
      
      toast({
        title: "Link gerado e copiado!",
        description: "O link foi copiado para a área de transferência.",
      });

      fetchData();
      setSelectedReservaForToken("");
    } catch (error: any) {
      console.error("Error generating token:", error);
      toast({
        title: "Erro ao gerar link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingToken(false);
    }
  };

  const copyTokenLink = async (token: string) => {
    const link = `${window.location.origin}/pesquisa-satisfacao?token=${token}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
    });
  };

  const deleteToken = async (token: string) => {
    try {
      const { error } = await supabase
        .from("tokens_pesquisa")
        .delete()
        .eq("token", token);

      if (error) throw error;

      toast({ title: "Token removido" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingLabel = (value: string) => {
    const labels: Record<string, string> = {
      excelente: "Excelente",
      muito_bom: "Muito Bom",
      bom: "Bom",
      regular: "Regular",
      ruim: "Ruim",
      muito_satisfeito: "Muito Satisfeito",
      satisfeito: "Satisfeito",
      neutro: "Neutro",
      insatisfeito: "Insatisfeito",
      muito_insatisfeito: "Muito Insatisfeito",
    };
    return labels[value] || value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Avaliações e Pesquisas</h1>
          <p className="text-muted-foreground">Gerencie feedbacks de profissionais e clientes</p>
        </div>

        <Tabs defaultValue="avaliacoes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="avaliacoes">
              Avaliações do Evento ({avaliacoes.length})
            </TabsTrigger>
            <TabsTrigger value="pesquisas">
              Satisfação do Cliente ({pesquisas.length})
            </TabsTrigger>
            <TabsTrigger value="tokens">
              Links de Pesquisa ({tokens.length})
            </TabsTrigger>
          </TabsList>

          {/* Avaliações do Evento */}
          <TabsContent value="avaliacoes" className="space-y-4">
            <Card className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por profissional ou evento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </Card>

            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : avaliacoes.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhuma avaliação encontrada
              </Card>
            ) : (
              <div className="grid gap-4">
                {avaliacoes
                  .filter((a) =>
                    searchTerm === "" ||
                    a.profissional_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.reservas?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((avaliacao) => (
                    <Card key={avaliacao.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{avaliacao.profissional_nome || "Não informado"}</p>
                          {avaliacao.reservas && (
                            <p className="text-sm text-muted-foreground">
                              Evento: {avaliacao.reservas.nome_completo} -{" "}
                              {new Date(avaliacao.reservas.data_evento).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Enviado em {formatDate(avaliacao.created_at)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAvaliacao(avaliacao)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Pesquisas de Satisfação */}
          <TabsContent value="pesquisas" className="space-y-4">
            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : pesquisas.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhuma pesquisa respondida ainda
              </Card>
            ) : (
              <div className="grid gap-4">
                {pesquisas.map((pesquisa) => (
                  <Card key={pesquisa.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {pesquisa.reservas && (
                          <p className="font-semibold">
                            {pesquisa.reservas.nome_completo}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          NPS: {pesquisa.respostas?.nps || "-"} | Satisfação:{" "}
                          {getRatingLabel(pesquisa.respostas?.satisfacao_geral || "")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Respondido em {formatDate(pesquisa.created_at)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPesquisa(pesquisa)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tokens de Pesquisa */}
          <TabsContent value="tokens" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Gerar Novo Link de Pesquisa</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">Selecione a reserva</label>
                  <Select
                    value={selectedReservaForToken}
                    onValueChange={setSelectedReservaForToken}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha uma reserva" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservas.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.nome_completo} - {new Date(r.data_evento).toLocaleDateString("pt-BR")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={generateToken}
                  disabled={generatingToken || !selectedReservaForToken}
                  className="bg-[#FF731D] hover:bg-[#FF731D]/90"
                >
                  {generatingToken ? "Gerando..." : (
                    <>
                      <Link2 className="w-4 h-4 mr-2" />
                      Gerar Link
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : tokens.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Nenhum link gerado ainda
              </Card>
            ) : (
              <div className="grid gap-4">
                {tokens.map((token) => (
                  <Card key={token.token} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {token.reservas && (
                          <p className="font-semibold">
                            {token.reservas.nome_completo}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {token.is_active && !token.used_at ? (
                            <span className="text-green-600">● Ativo</span>
                          ) : (
                            <span className="text-gray-500">● Utilizado em {token.used_at ? formatDate(token.used_at) : "-"}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criado em {formatDate(token.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {token.is_active && !token.used_at && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyTokenLink(token.token)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteToken(token.token)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal de Avaliação */}
        <Dialog open={!!selectedAvaliacao} onOpenChange={() => setSelectedAvaliacao(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Avaliação</DialogTitle>
              <DialogDescription>
                {selectedAvaliacao?.profissional_nome || "Profissional não informado"}
              </DialogDescription>
            </DialogHeader>
            {selectedAvaliacao && (
              <div className="space-y-4">
                {Object.entries(selectedAvaliacao.respostas || {}).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="font-medium">
                      {Array.isArray(value) ? value.join(", ") : getRatingLabel(String(value))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Pesquisa */}
        <Dialog open={!!selectedPesquisa} onOpenChange={() => setSelectedPesquisa(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Pesquisa</DialogTitle>
              <DialogDescription>
                {selectedPesquisa?.reservas?.nome_completo || "Cliente"}
              </DialogDescription>
            </DialogHeader>
            {selectedPesquisa && (
              <div className="space-y-4">
                {Object.entries(selectedPesquisa.respostas || {}).map(([key, value]) => (
                  <div key={key} className="border-b pb-2">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="font-medium">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "boolean"
                        ? value ? "Sim" : "Não"
                        : getRatingLabel(String(value))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminAvaliacoes;
