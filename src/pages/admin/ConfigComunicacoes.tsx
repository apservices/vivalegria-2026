import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, FileText, Save, Eye, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface EmailTemplate {
  id: string;
  tipo: string;
  nome: string;
  subject: string;
  body: string;
}

interface ContractTemplate {
  id: string;
  tipo: string;
  nome: string;
  body_html: string;
  footer_html: string | null;
}

// Placeholders disponíveis
const PLACEHOLDERS = [
  { key: "{{nome_cliente}}", desc: "Nome completo do cliente" },
  { key: "{{cpf_cnpj}}", desc: "CPF ou CNPJ do cliente" },
  { key: "{{telefone}}", desc: "Telefone do cliente" },
  { key: "{{email}}", desc: "E-mail do cliente" },
  { key: "{{codigo}}", desc: "Código da reserva (ex: VIVA1001)" },
  { key: "{{data_evento}}", desc: "Data do evento formatada" },
  { key: "{{hora_inicio}}", desc: "Horário de início" },
  { key: "{{local_evento}}", desc: "Nome do local do evento" },
  { key: "{{endereco_completo}}", desc: "Endereço completo" },
  { key: "{{pacote_tipo}}", desc: "Tipo de pacote (Clássico, Select, etc.)" },
  { key: "{{numero_criancas}}", desc: "Número de crianças" },
  { key: "{{oficinas}}", desc: "Lista de oficinas selecionadas" },
  { key: "{{extras}}", desc: "Extras contratados" },
  { key: "{{valor_total}}", desc: "Valor total formatado" },
  { key: "{{data_geracao}}", desc: "Data/hora de geração do contrato" },
];

// Dados fictícios para preview
const PREVIEW_DATA: Record<string, string> = {
  "{{nome_cliente}}": "Maria da Silva",
  "{{cpf_cnpj}}": "123.456.789-00",
  "{{telefone}}": "(11) 99999-9999",
  "{{email}}": "maria@exemplo.com",
  "{{codigo}}": "VIVA1001",
  "{{data_evento}}": "15/03/2026",
  "{{hora_inicio}}": "14:00",
  "{{local_evento}}": "Buffet Alegria Kids",
  "{{endereco_completo}}": "Rua das Flores, 123 - Vila Mariana, São Paulo/SP",
  "{{pacote_tipo}}": "Select",
  "{{numero_criancas}}": "25",
  "{{oficinas}}": "Slime, Pintura em Tela",
  "{{extras}}": "Recreador adicional, Hora extra",
  "{{valor_total}}": "1.890,00",
  "{{data_geracao}}": new Date().toLocaleString("pt-BR"),
};

const replaceWithPreview = (text: string): string => {
  let result = text;
  Object.entries(PREVIEW_DATA).forEach(([key, value]) => {
    result = result.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value);
  });
  return result;
};

const ConfigComunicacoes = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailTemplate | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewType, setPreviewType] = useState<"email" | "contract">("email");

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchTemplates();
    }
  }, [user, isAdmin]);

  const fetchTemplates = async () => {
    try {
      const [emailRes, contractRes] = await Promise.all([
        supabase.from("email_templates").select("*").order("tipo"),
        supabase.from("contract_templates").select("*").order("tipo"),
      ]);

      if (emailRes.data) {
        setEmailTemplates(emailRes.data);
        if (emailRes.data.length > 0) setSelectedEmail(emailRes.data[0]);
      }
      if (contractRes.data) {
        setContractTemplates(contractRes.data);
        if (contractRes.data.length > 0) setSelectedContract(contractRes.data[0]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const saveEmailTemplate = async () => {
    if (!selectedEmail) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("email_templates")
        .update({
          nome: selectedEmail.nome,
          subject: selectedEmail.subject,
          body: selectedEmail.body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedEmail.id);

      if (error) throw error;

      toast({
        title: "Template salvo!",
        description: "O template de e-mail foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error saving email template:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveContractTemplate = async () => {
    if (!selectedContract) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("contract_templates")
        .update({
          nome: selectedContract.nome,
          body_html: selectedContract.body_html,
          footer_html: selectedContract.footer_html,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedContract.id);

      if (error) throw error;

      toast({
        title: "Template salvo!",
        description: "O template de contrato foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error saving contract template:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openPreview = (type: "email" | "contract") => {
    setPreviewType(type);
    if (type === "email" && selectedEmail) {
      setPreviewContent(replaceWithPreview(selectedEmail.body));
    } else if (type === "contract" && selectedContract) {
      setPreviewContent(replaceWithPreview(selectedContract.body_html + (selectedContract.footer_html || "")));
    }
    setPreviewOpen(true);
  };

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações de Comunicação</h1>
          <p className="text-muted-foreground">
            Edite os templates de e-mail e contratos enviados aos clientes
          </p>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Templates de E-mail
            </TabsTrigger>
            <TabsTrigger value="contract" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates de Contrato
            </TabsTrigger>
          </TabsList>

          {/* Email Templates Tab */}
          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Placeholders Reference */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Placeholders Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                    {PLACEHOLDERS.map((p) => (
                      <div key={p.key} className="flex flex-col">
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {p.key}
                        </code>
                        <span className="text-muted-foreground text-xs mt-1">
                          {p.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Email Editor */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {selectedEmail?.nome || "Selecione um template"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedEmail ? (
                    <>
                      <div className="space-y-2">
                        <Label>Nome do Template</Label>
                        <Input
                          value={selectedEmail.nome}
                          onChange={(e) =>
                            setSelectedEmail({ ...selectedEmail, nome: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Assunto do E-mail</Label>
                        <Input
                          value={selectedEmail.subject}
                          onChange={(e) =>
                            setSelectedEmail({ ...selectedEmail, subject: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Corpo do E-mail (texto)</Label>
                        <Textarea
                          value={selectedEmail.body}
                          onChange={(e) =>
                            setSelectedEmail({ ...selectedEmail, body: e.target.value })
                          }
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={saveEmailTemplate} disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Salvando..." : "Salvar Template"}
                        </Button>
                        <Button variant="outline" onClick={() => openPreview("email")}>
                          <Eye className="w-4 h-4 mr-2" />
                          Pré-visualizar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Nenhum template de e-mail encontrado.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contract Templates Tab */}
          <TabsContent value="contract" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Placeholders Reference */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Placeholders Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                    {PLACEHOLDERS.map((p) => (
                      <div key={p.key} className="flex flex-col">
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {p.key}
                        </code>
                        <span className="text-muted-foreground text-xs mt-1">
                          {p.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contract Editor */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {selectedContract?.nome || "Selecione um template"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedContract ? (
                    <>
                      <div className="space-y-2">
                        <Label>Nome do Template</Label>
                        <Input
                          value={selectedContract.nome}
                          onChange={(e) =>
                            setSelectedContract({ ...selectedContract, nome: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Corpo do Contrato (HTML)</Label>
                        <Textarea
                          value={selectedContract.body_html}
                          onChange={(e) =>
                            setSelectedContract({ ...selectedContract, body_html: e.target.value })
                          }
                          className="min-h-[300px] font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rodapé (HTML - opcional)</Label>
                        <Textarea
                          value={selectedContract.footer_html || ""}
                          onChange={(e) =>
                            setSelectedContract({ ...selectedContract, footer_html: e.target.value })
                          }
                          className="min-h-[100px] font-mono text-sm"
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={saveContractTemplate} disabled={saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saving ? "Salvando..." : "Salvar Template"}
                        </Button>
                        <Button variant="outline" onClick={() => openPreview("contract")}>
                          <Eye className="w-4 h-4 mr-2" />
                          Pré-visualizar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Nenhum template de contrato encontrado.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                Pré-visualização - {previewType === "email" ? "E-mail" : "Contrato"}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {previewType === "email" ? (
                <div className="bg-muted p-6 rounded-lg whitespace-pre-wrap font-sans">
                  {previewContent}
                </div>
              ) : (
                <div
                  className="bg-white p-6 rounded-lg border"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ConfigComunicacoes;
