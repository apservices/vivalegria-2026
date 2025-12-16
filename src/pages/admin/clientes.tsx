// src/pages/admin/Clientes.tsx
import { useEffect, useState } from "react";
import { Search, Filter, User, Phone, MapPin, Calendar, Star, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminClientes = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("clientes") // ou "usuarios" se for o nome da tabela
        .select("*")
        .order("created_at", { ascending: false });
      
      setClientes(data || []);
    } catch (error) {
      console.error("Erro clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = clientes;
    if (search) {
      result = result.filter(c => 
        c.nome?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [clientes, search]);

  if (loading) {
    return <AdminLayout><div>Carregando clientes...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">{clientes.length} clientes cadastrados</p>
          </div>
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 12).map((cliente) => (
            <Card key={cliente.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="font-bold text-xl">{cliente.nome}</div>
                <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>
                  {cliente.status || 'ativo'}
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {cliente.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {cliente.telefone || 'N/I'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {cliente.cidade}, {cliente.estado}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Membro desde: {cliente.created_at?.split('T')[0] || 'N/I'}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Eventos: {cliente.total_eventos || 0}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Histórico
                </Button>
                <Button size="sm" className="flex-1">Editar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClientes;
