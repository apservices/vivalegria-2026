import { useState } from "react";
import { Upload, FileText, Users, AlertTriangle, Star, Check, X, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  parseCSV,
  parseRecreadoresCSV,
  parseReclamacoesCSV,
  parsePesquisasCSV,
  recreadorToSupabase,
  reclamacaoToSupabase,
  pesquisaToSupabase,
  RecreadorCSVRow,
  ReclamacaoCSVRow,
  PesquisaCSVRow
} from "@/utils/csvImport";

type ImportType = 'recreadores' | 'reclamacoes' | 'pesquisas';

const ImportarDados = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ImportType>('recreadores');
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Parsed data
  const [recreadores, setRecreadores] = useState<RecreadorCSVRow[]>([]);
  const [reclamacoes, setReclamacoes] = useState<ReclamacaoCSVRow[]>([]);
  const [pesquisas, setPesquisas] = useState<PesquisaCSVRow[]>([]);
  
  // Import stats
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    errors: 0
  });

  const loadPresetCSV = async (type: ImportType) => {
    setIsLoading(true);
    try {
      const paths: Record<ImportType, string> = {
        recreadores: '/data/recreadores.csv',
        reclamacoes: '/data/reclamacoes.csv',
        pesquisas: '/data/pesquisas.csv'
      };
      
      const response = await fetch(paths[type]);
      if (!response.ok) throw new Error('Arquivo não encontrado');
      
      const text = await response.text();
      const rows = parseCSV(text);
      
      switch (type) {
        case 'recreadores':
          const recreadoresData = parseRecreadoresCSV(rows);
          setRecreadores(recreadoresData);
          toast({ title: `${recreadoresData.length} recreadores carregados` });
          break;
        case 'reclamacoes':
          const reclamacoesData = parseReclamacoesCSV(rows);
          setReclamacoes(reclamacoesData);
          toast({ title: `${reclamacoesData.length} reclamações carregadas` });
          break;
        case 'pesquisas':
          const pesquisasData = parsePesquisasCSV(rows);
          setPesquisas(pesquisasData);
          toast({ title: `${pesquisasData.length} pesquisas carregadas` });
          break;
      }
    } catch (error) {
      console.error('Error loading CSV:', error);
      toast({
        title: "Erro ao carregar arquivo",
        description: "Verifique se o arquivo existe em /public/data/",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: ImportType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      switch (type) {
        case 'recreadores':
          const recreadoresData = parseRecreadoresCSV(rows);
          setRecreadores(recreadoresData);
          toast({ title: `${recreadoresData.length} recreadores carregados` });
          break;
        case 'reclamacoes':
          const reclamacoesData = parseReclamacoesCSV(rows);
          setReclamacoes(reclamacoesData);
          toast({ title: `${reclamacoesData.length} reclamações carregadas` });
          break;
        case 'pesquisas':
          const pesquisasData = parsePesquisasCSV(rows);
          setPesquisas(pesquisasData);
          toast({ title: `${pesquisasData.length} pesquisas carregadas` });
          break;
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: "Verifique se o formato do CSV está correto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importRecreadores = async () => {
    if (recreadores.length === 0) return;
    
    setIsImporting(true);
    setProgress(0);
    setImportStats({ total: recreadores.length, success: 0, errors: 0 });
    
    const batchSize = 50;
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < recreadores.length; i += batchSize) {
      const batch = recreadores.slice(i, i + batchSize);
      const records = batch.map(recreadorToSupabase);
      
      const { error } = await supabase
        .from('profissionais')
        .upsert(records, { 
          onConflict: 'cpf',
          ignoreDuplicates: true 
        });
      
      if (error) {
        console.error('Batch error:', error);
        errors += batch.length;
      } else {
        success += batch.length;
      }
      
      setProgress(Math.round(((i + batch.length) / recreadores.length) * 100));
      setImportStats({ total: recreadores.length, success, errors });
    }
    
    setIsImporting(false);
    toast({
      title: "Importação concluída",
      description: `${success} recreadores importados, ${errors} erros`
    });
  };

  const importReclamacoes = async () => {
    if (reclamacoes.length === 0) return;
    
    // First, get a placeholder reserva_id (we need at least one reservation)
    const { data: firstReserva } = await supabase
      .from('reservas')
      .select('id')
      .limit(1)
      .single();
    
    const placeholderReservaId = firstReserva?.id;
    
    if (!placeholderReservaId) {
      toast({
        title: "Erro",
        description: "É necessário ter pelo menos uma reserva no sistema para importar reclamações",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    setProgress(0);
    setImportStats({ total: reclamacoes.length, success: 0, errors: 0 });
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < reclamacoes.length; i++) {
      const record = reclamacaoToSupabase(reclamacoes[i], placeholderReservaId);
      
      const { error } = await supabase
        .from('reclamacoes')
        .insert([record]);
      
      if (error) {
        console.error('Insert error:', error);
        errors++;
      } else {
        success++;
      }
      
      if (i % 10 === 0) {
        setProgress(Math.round(((i + 1) / reclamacoes.length) * 100));
        setImportStats({ total: reclamacoes.length, success, errors });
      }
    }
    
    setProgress(100);
    setImportStats({ total: reclamacoes.length, success, errors });
    setIsImporting(false);
    
    toast({
      title: "Importação concluída",
      description: `${success} reclamações importadas, ${errors} erros`
    });
  };

  const importPesquisas = async () => {
    if (pesquisas.length === 0) return;
    
    setIsImporting(true);
    setProgress(0);
    setImportStats({ total: pesquisas.length, success: 0, errors: 0 });
    
    let success = 0;
    let errors = 0;
    
    for (let i = 0; i < pesquisas.length; i++) {
      const record = pesquisaToSupabase(pesquisas[i]);
      
      const { error } = await supabase
        .from('pesquisas_clientes')
        .insert([record]);
      
      if (error) {
        console.error('Insert error:', error);
        errors++;
      } else {
        success++;
      }
      
      if (i % 10 === 0) {
        setProgress(Math.round(((i + 1) / pesquisas.length) * 100));
        setImportStats({ total: pesquisas.length, success, errors });
      }
    }
    
    setProgress(100);
    setImportStats({ total: pesquisas.length, success, errors });
    setIsImporting(false);
    
    toast({
      title: "Importação concluída",
      description: `${success} pesquisas importadas, ${errors} erros`
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Importar Dados</h1>
          <p className="text-muted-foreground">
            Importe dados históricos de recreadores, reclamações e pesquisas de satisfação
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImportType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recreadores" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recreadores
            </TabsTrigger>
            <TabsTrigger value="reclamacoes" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Reclamações
            </TabsTrigger>
            <TabsTrigger value="pesquisas" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Pesquisas NPS
            </TabsTrigger>
          </TabsList>

          {/* Recreadores Tab */}
          <TabsContent value="recreadores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar Recreadores</CardTitle>
                <CardDescription>
                  Importe a base de 733 recreadores do JotForm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => loadPresetCSV('recreadores')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    Carregar CSV Padrão
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'recreadores')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>

                {recreadores.length > 0 && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{recreadores.length} recreadores carregados</p>
                        <p className="text-sm text-muted-foreground">Pronto para importar</p>
                      </div>
                      <Button onClick={importRecreadores} disabled={isImporting}>
                        {isImporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Importar Todos
                          </>
                        )}
                      </Button>
                    </div>

                    {isImporting && (
                      <div className="space-y-2">
                        <Progress value={progress} />
                        <div className="flex justify-between text-sm">
                          <span>{importStats.success} sucesso</span>
                          <span>{importStats.errors} erros</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Registro</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Apelido</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Telefone</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recreadores.slice(0, 10).map((r, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono">{r.registro}</TableCell>
                              <TableCell>{r.nome_completo}</TableCell>
                              <TableCell>{r.apelido}</TableCell>
                              <TableCell>{r.cpf}</TableCell>
                              <TableCell>{r.telefone}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {recreadores.length > 10 && (
                        <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                          ... e mais {recreadores.length - 10} registros
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reclamações Tab */}
          <TabsContent value="reclamacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar Reclamações</CardTitle>
                <CardDescription>
                  Importe os 447 tickets de reclamação históricos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => loadPresetCSV('reclamacoes')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    Carregar CSV Padrão
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'reclamacoes')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>

                {reclamacoes.length > 0 && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{reclamacoes.length} reclamações carregadas</p>
                        <p className="text-sm text-muted-foreground">Pronto para importar</p>
                      </div>
                      <Button onClick={importReclamacoes} disabled={isImporting}>
                        {isImporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Importar Todos
                          </>
                        )}
                      </Button>
                    </div>

                    {isImporting && (
                      <div className="space-y-2">
                        <Progress value={progress} />
                        <div className="flex justify-between text-sm">
                          <span>{importStats.success} sucesso</span>
                          <span>{importStats.errors} erros</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Protocolo</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reclamacoes.slice(0, 10).map((r, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono">{r.protocolo}</TableCell>
                              <TableCell>{r.nome_cliente}</TableCell>
                              <TableCell>{r.telefone_cliente}</TableCell>
                              <TableCell className="max-w-xs truncate">{r.descricao}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {reclamacoes.length > 10 && (
                        <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                          ... e mais {reclamacoes.length - 10} registros
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pesquisas Tab */}
          <TabsContent value="pesquisas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar Pesquisas de Satisfação</CardTitle>
                <CardDescription>
                  Importe as 98 pesquisas NPS históricas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => loadPresetCSV('pesquisas')}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    Carregar CSV Padrão
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'pesquisas')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </Button>
                  </div>
                </div>

                {pesquisas.length > 0 && (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{pesquisas.length} pesquisas carregadas</p>
                        <p className="text-sm text-muted-foreground">Pronto para importar</p>
                      </div>
                      <Button onClick={importPesquisas} disabled={isImporting}>
                        {isImporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importando...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Importar Todos
                          </>
                        )}
                      </Button>
                    </div>

                    {isImporting && (
                      <div className="space-y-2">
                        <Progress value={progress} />
                        <div className="flex justify-between text-sm">
                          <span>{importStats.success} sucesso</span>
                          <span>{importStats.errors} erros</span>
                          <span>{progress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>NPS</TableHead>
                            <TableHead>Qualidade</TableHead>
                            <TableHead>Satisfação</TableHead>
                            <TableHead>Contrataria</TableHead>
                            <TableHead>Cliente</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pesquisas.slice(0, 10).map((p, i) => (
                            <TableRow key={i}>
                              <TableCell>{p.data}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={p.nps_score >= 9 ? "default" : p.nps_score >= 7 ? "secondary" : "destructive"}
                                >
                                  {p.nps_score}
                                </Badge>
                              </TableCell>
                              <TableCell>{p.qualidade_recreacao}</TableCell>
                              <TableCell>{p.satisfacao_profissionais}</TableCell>
                              <TableCell>
                                {p.contrataria_novamente ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell>{p.nome_cliente}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {pesquisas.length > 10 && (
                        <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
                          ... e mais {pesquisas.length - 10} registros
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ImportarDados;