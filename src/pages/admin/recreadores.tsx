// src/pages/admin/Recreadores.tsx
import { useEffect, useState } from "react";
import { Search, Filter, Users, MapPin, Star, Calendar, DollarSign, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminRecreadores = () => {
  const [recreadores, setRecreadores] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecreadores();
  }, []);

  const fetchRecreadores = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("profissionais")
        .select("*")
        .order("created_at", { ascending: false });
      
      setRecreadores(data || []);
    } catch (error) {
      console.error("Erro recreadores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = recreadores;
    if (search) {
      result = result.filter(r => 
        r.nome?.toLowerCase().includes(search.toLowerCase()) ||
        r.especialidade?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [recreadores, search]);

  if (loading) {
    return <AdminLayout><div>Carregando recreadores...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Recreadores</h1>
            <p className="text-muted-foreground">{recreadores.length} profissionais ativos</p>
          </div>
          <Input
            placeholder="Buscar por nome ou especialidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 12).map((rec) => (
            <Card key={rec.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="font-bold text-xl">{rec.nome}</div>
                <Badge>{rec.especialidade || 'Multi'}</Badge>
              </div>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {rec.cidade || 'SP'}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {rec.avaliacao || 'N/A'} ( {rec.total_avaliacoes || 0} )
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Cache médio: R$ {rec.cache_medio || 0}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Eventos: {rec.total_eventos || 0}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Perfil
                </Button>
                <Button size="sm" className="flex-1">Alocar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRecreadores;
