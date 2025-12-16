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

/* =======================
   Interfaces
======================= */

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

/* =======================
   Placeholders
======================= */

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
  { key: "{{pacote_tipo}}", desc: "Tipo de pacote" },
  { key: "{{numero_criancas}}", desc: "Número de crianças" },
  { key: "{{oficinas}}", desc: "Lista de oficinas" },
  { key: "{{extras}}", desc: "Extras contratados" },
  { key: "{{valor_total}}", desc: "Valor total formatado" },
  { key: "{{data_geracao}}", desc: "Data/hora de geração do contrato" },
];

/* =======================
   Preview Data
======================= */

const PREVIEW_DATA: Record<string, string> = {
  "{{nome_cliente}}": "Maria da Silva",
  "{{cpf_cnpj}}": "123.456.789-00",
  "{{telefone}}": "(11) 99999-9999",
  "{{email}}": "maria@exemplo.com",
  "{{codigo}}": "VIVA1001",
  "{{data_evento}}": "15/03/2026",
  "{{hora_inicio}}": "14:00",
  "{{local_evento}}": "Buffet Alegria Kids",
  "{{endereco_completo}}": "Rua das Flores, 123 - São Paulo/SP",
  "{{pacote_tipo}}": "Select",
  "{{numero_criancas}}": "25",
  "{{oficinas}}": "Slime, Pintura em Tela",
  "{{extras}}": "Recreador adicional",
  "{{valor_total}}": "R$ 1.890,00",
  "{{data_geracao}}": new Date().toLocaleString("pt-BR"),
};

const replaceWithPreview = (html: string) => {
  let result = html;
  Object.entries(PREVIEW_DATA).forEach(([key, value]) => {
    result = result.replace(
      new RegExp(key.replace(/[{}]/g, "\\$&"), "g"),
      value
    );
  });
  return result;
};

const buildContractPreview = (body: string, footer?: string | null) => {
  return replaceWithPreview(`
    <div style="
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
    ">
      ${body}
      ${footer || ""}
    </div>
  `);
};

/* =======================
   Component
======================= */

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
    if (user && isAdmin) fetchTemplates();
  }, [user, isAdmin]);

  const fetchTemplates = async () => {
    const [emailRes, contractRes] = await Promise.all([
      supabase.from("email_templates").select("*").order("tipo"),
      supabase.from("contract_templates").select("*").order("tipo"),
    ]);

    if (emailRes.data) {
      setEmailTemplates(emailRes.data);
      setSelectedEmail(emailRes.data[0] || null);
    }
    if (contractRes.data) {
      setContractTemplates(contractRes.data);
      setSelectedContract(contractRes.data[0] || null);
    }
  };

  const saveEmailTemplate = async () => {
    if (!selectedEmail) return;
    setSaving(true);

    const { error } = await supabase
      .from("email_templates")
      .update({
        nome: selectedEmail.nome,
        subject: selectedEmail.subject,
        body: selectedEmail.body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedEmail.id);

    setSaving(false);

    toast({
      title: error ? "Erro ao salvar" : "Template salvo!",
      variant: error ? "destructive" : "default",
    });
  };

  const saveContractTemplate = async () => {
    if (!selectedContract) return;
    setSaving(true);

    const { error } = await supabase
      .from("contract_templates")
      .update({
        nome: selectedContract.nome,
        body_html: selectedContract.body_html,
        footer_html: selectedContract.footer_html,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedContract.id);

    setSaving(false);

    toast({
      title: error ? "Erro ao salvar" : "Contrato salvo!",
      variant: error ? "destructive" : "default",
    });
  };

  const openPreview = (type: "email" | "contract") => {
    setPreviewType(type);

    if (type === "email" && selectedEmail) {
      setPreviewContent(replaceWithPreview(selectedEmail.body));
    }

    if (type === "contract" && selectedContract) {
      setPreviewContent(
        buildContractPreview(
          selectedContract.body_html,
          selectedContract.footer_html
        )
      );
    }

    setPreviewOpen(true);
  };

  if (isLoading) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações de Comunicação</h1>

        <Tabs defaultValue="email">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />E-mails</TabsTrigger>
            <TabsTrigger value="contract"><FileText className="w-4 h-4 mr-2" />Contratos</TabsTrigger>
          </TabsList>

          {/* EMAIL */}
          <TabsContent value="email" className="grid lg:grid-cols-3 gap-6">
            <PlaceholderCard />
            <EditorEmail {...{ selectedEmail, setSelectedEmail, saveEmailTemplate, saving, openPreview }} />
          </TabsContent>

          {/* CONTRACT */}
          <TabsContent value="contract" className="grid lg:grid-cols-3 gap-6">
            <PlaceholderCard />
            <EditorContract {...{ selectedContract, setSelectedContract, saveContractTemplate, saving, openPreview }} />
          </TabsContent>
        </Tabs>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Pré-visualização</DialogTitle>
            </DialogHeader>
            {previewType === "email" ? (
              <div className="bg-muted p-6 rounded whitespace-pre-wrap">{previewContent}</div>
            ) : (
              <div className="bg-muted p-6 flex justify-center">
                <div
                  className="bg-white shadow-lg rounded w-full max-w-[900px]"
                  dangerouslySetInnerHTML={{ __html: previewContent }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

/* =======================
   Sub Components
======================= */

const PlaceholderCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Info className="w-4 h-4" /> Placeholders
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
      {PLACEHOLDERS.map(p => (
        <div key={p.key}>
          <code className="bg-muted px-2 py-1 rounded text-xs">{p.key}</code>
          <p className="text-muted-foreground text-xs">{p.desc}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const EditorEmail = ({ selectedEmail, setSelectedEmail, saveEmailTemplate, saving, openPreview }: any) => (
  <Card className="lg:col-span-2">
    <CardContent className="space-y-4">
      <Input value={selectedEmail?.nome || ""} onChange={e => setSelectedEmail({ ...selectedEmail, nome: e.target.value })} />
      <Input value={selectedEmail?.subject || ""} onChange={e => setSelectedEmail({ ...selectedEmail, subject: e.target.value })} />
      <Textarea className="min-h-[300px] font-mono" value={selectedEmail?.body || ""} onChange={e => setSelectedEmail({ ...selectedEmail, body: e.target.value })} />
      <Actions save={saveEmailTemplate} saving={saving} preview={() => openPreview("email")} />
    </CardContent>
  </Card>
);

const EditorContract = ({ selectedContract, setSelectedContract, saveContractTemplate, saving, openPreview }: any) => (
  <Card className="lg:col-span-2">
    <CardContent className="space-y-4">
      <Input value={selectedContract?.nome || ""} onChange={e => setSelectedContract({ ...selectedContract, nome: e.target.value })} />
      <Textarea className="min-h-[300px] font-mono" value={selectedContract?.body_html || ""} onChange={e => setSelectedContract({ ...selectedContract, body_html: e.target.value })} />
      <Textarea className="min-h-[120px] font-mono" value={selectedContract?.footer_html || ""} onChange={e => setSelectedContract({ ...selectedContract, footer_html: e.target.value })} />
      <Actions save={saveContractTemplate} saving={saving} preview={() => openPreview("contract")} />
    </CardContent>
  </Card>
);

const Actions = ({ save, saving, preview }: any) => (
  <div className="flex gap-3">
    <Button onClick={save} disabled={saving}>
      <Save className="w-4 h-4 mr-2" /> Salvar
    </Button>
    <Button variant="outline" onClick={preview}>
      <Eye className="w-4 h-4 mr-2" /> Pré-visualizar
    </Button>
  </div>
);

export default ConfigComunicacoes;
