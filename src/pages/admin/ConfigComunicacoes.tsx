// ConfigComunicacoes.tsx — VERSÃO FINAL LIMPA E ESTÁVEL

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Mail, FileText, Save, Eye, Info } from "lucide-react";

/* =======================
   Interfaces
======================= */
interface EmailTemplate {
  id: string;
  nome: string;
  subject: string;
  body: string;
}

interface ContractTemplate {
  id: string;
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
  { key: "{{codigo}}", desc: "Código da reserva" },
  { key: "{{data_evento}}", desc: "Data do evento" },
  { key: "{{hora_inicio}}", desc: "Horário de início" },
  { key: "{{local_evento}}", desc: "Local do evento" },
  { key: "{{endereco_completo}}", desc: "Endereço completo" },
  { key: "{{pacote_tipo}}", desc: "Tipo de pacote" },
  { key: "{{numero_criancas}}", desc: "Número de crianças" },
  { key: "{{oficinas}}", desc: "Oficinas contratadas" },
  { key: "{{extras}}", desc: "Extras contratados" },
  { key: "{{valor_total}}", desc: "Valor total" },
  { key: "{{data_geracao}}", desc: "Data de geração" },
];

/* =======================
   Preview Data
======================= */
const PREVIEW_DATA: Record<string, string> = {
  "{{nome_cliente}}": "Maria da Silva",
  "{{cpf_cnpj}}": "123.456.789-00",
  "{{telefone}}": "(11) 99999-9999",
  "{{email}}": "maria@email.com",
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
    <div style="max-width:900px;margin:0 auto;font-family:Arial">
      ${body}
      ${footer || ""}
    </div>
  `);
};

/* =======================
   Component
======================= */
export default function ConfigComunicacoes() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailTemplate | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractTemplate | null>(null);

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) fetchTemplates();
  }, [user, isAdmin]);

  const fetchTemplates = async () => {
    const [emailRes, contractRes] = await Promise.all([
      supabase.from("email_templates").select("*").order("nome"),
      supabase.from("contract_templates").select("*").order("nome"),
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

  const saveEmail = async () => {
    if (!selectedEmail) return;
    setSaving(true);
    const { error } = await supabase
      .from("email_templates")
      .update(selectedEmail)
      .eq("id", selectedEmail.id);
    setSaving(false);
    toast({
      title: error ? "Erro" : "Salvo",
      description: error ? "Falha ao salvar" : "Template atualizado",
      variant: error ? "destructive" : "default",
    });
  };

  const saveContract = async () => {
    if (!selectedContract) return;
    setSaving(true);
    const { error } = await supabase
      .from("contract_templates")
      .update(selectedContract)
      .eq("id", selectedContract.id);
    setSaving(false);
    toast({
      title: error ? "Erro" : "Salvo",
      description: error ? "Falha ao salvar" : "Contrato atualizado",
      variant: error ? "destructive" : "default",
    });
  };

  if (isLoading) return null;

  return (
    <AdminLayout>
      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md">
          <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" />E-mails</TabsTrigger>
          <TabsTrigger value="contract"><FileText className="w-4 h-4 mr-2" />Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="grid lg:grid-cols-3 gap-6">
          <PlaceholderCard />
          <EditorEmail
            selected={selectedEmail}
            setSelected={setSelectedEmail}
            onSave={saveEmail}
            saving={saving}
            onPreview={() => {
              if (selectedEmail) {
                setPreviewHTML(replaceWithPreview(selectedEmail.body));
                setPreviewOpen(true);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="contract" className="grid lg:grid-cols-3 gap-6">
          <PlaceholderCard />
          <EditorContract
            selected={selectedContract}
            setSelected={setSelectedContract}
            onSave={saveContract}
            saving={saving}
            onPreview={() => {
              if (selectedContract) {
                setPreviewHTML(
                  buildContractPreview(
                    selectedContract.body_html,
                    selectedContract.footer_html
                  )
                );
                setPreviewOpen(true);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização</DialogTitle>
          </DialogHeader>
          <div className="bg-muted p-6 flex justify-center">
            <div
              className="bg-white shadow-lg rounded w-full max-w-[900px]"
              dangerouslySetInnerHTML={{ __html: previewHTML }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

/* =======================
   Subcomponents
======================= */
const PlaceholderCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2"><Info className="w-4 h-4" /> Placeholders</CardTitle>
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

const EditorEmail = ({ selected, setSelected, onSave, saving, onPreview }: any) => (
  <Card className="lg:col-span-2">
    <CardContent className="space-y-4">
      <Label>Nome</Label>
      <Input value={selected?.nome || ""} onChange={e => setSelected({ ...selected, nome: e.target.value })} />
      <Label>Assunto</Label>
      <Input value={selected?.subject || ""} onChange={e => setSelected({ ...selected, subject: e.target.value })} />
      <Label>Corpo</Label>
      <Textarea className="min-h-[300px] font-mono" value={selected?.body || ""} onChange={e => setSelected({ ...selected, body: e.target.value })} />
      <Actions onSave={onSave} saving={saving} onPreview={onPreview} />
    </CardContent>
  </Card>
);

const EditorContract = ({ selected, setSelected, onSave, saving, onPreview }: any) => (
  <Card className="lg:col-span-2">
    <CardContent className="space-y-4">
      <Label>Nome</Label>
      <Input value={selected?.nome || ""} onChange={e => setSelected({ ...selected, nome: e.target.value })} />
      <Label>Corpo (HTML)</Label>
      <Textarea className="min-h-[300px] font-mono" value={selected?.body_html || ""} onChange={e => setSelected({ ...selected, body_html: e.target.value })} />
      <Label>Rodapé</Label>
      <Textarea className="min-h-[120px] font-mono" value={selected?.footer_html || ""} onChange={e => setSelected({ ...selected, footer_html: e.target.value })} />
      <Actions onSave={onSave} saving={saving} onPreview={onPreview} />
    </CardContent>
  </Card>
);

const Actions = ({ onSave, saving, onPreview }: any) => (
  <div className="flex gap-3">
    <Button onClick={onSave} disabled={saving}><Save className="w-4 h-4 mr-2" />Salvar</Button>
    <Button variant="outline" onClick={onPreview}><Eye className="w-4 h-4 mr-2" />Pré-visualizar</Button>
  </div>
);
