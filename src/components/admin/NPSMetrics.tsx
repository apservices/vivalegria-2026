import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NPSData {
  nps?: number | string;
  satisfacao_geral?: string;
  created_at: string;
  reserva_id?: string | null;
}

interface NPSMetricsProps {
  pesquisas: NPSData[];
}

const NPSMetrics = ({ pesquisas }: NPSMetricsProps) => {
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Filtrar por período
    const last30Days = pesquisas.filter(p => new Date(p.created_at) >= thirtyDaysAgo);
    const last90Days = pesquisas.filter(p => new Date(p.created_at) >= ninetyDaysAgo);

    // Calcular NPS
    const calculateNPS = (data: NPSData[]) => {
      const validScores = data
        .map(p => typeof p.nps === 'string' ? parseInt(p.nps, 10) : p.nps)
        .filter((n): n is number => typeof n === 'number' && !isNaN(n));

      if (validScores.length === 0) return { nps: 0, promoters: 0, passives: 0, detractors: 0, total: 0 };

      const promoters = validScores.filter(n => n >= 9).length;
      const passives = validScores.filter(n => n >= 7 && n <= 8).length;
      const detractors = validScores.filter(n => n <= 6).length;
      const total = validScores.length;

      const nps = Math.round(((promoters - detractors) / total) * 100);

      return { nps, promoters, passives, detractors, total };
    };

    const nps30 = calculateNPS(last30Days);
    const nps90 = calculateNPS(last90Days);
    const npsAll = calculateNPS(pesquisas);

    // Calcular tendência (comparação entre 30 e 90 dias)
    const trend = nps30.nps - nps90.nps;

    // Identificar alertas (NPS < 7)
    const alertCount = pesquisas.filter(p => {
      const score = typeof p.nps === 'string' ? parseInt(p.nps, 10) : p.nps;
      return typeof score === 'number' && score <= 6;
    }).length;

    return { nps30, nps90, npsAll, trend, alertCount };
  }, [pesquisas]);

  const getNPSColor = (nps: number) => {
    if (nps >= 70) return 'text-green-600';
    if (nps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNPSLabel = (nps: number) => {
    if (nps >= 70) return 'Excelente';
    if (nps >= 50) return 'Muito Bom';
    if (nps >= 30) return 'Bom';
    if (nps >= 0) return 'Regular';
    return 'Crítico';
  };

  return (
    <div className="space-y-6">
      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getNPSColor(metrics.nps30.nps)}`}>
              {metrics.nps30.total > 0 ? metrics.nps30.nps : '—'}
            </div>
            {metrics.nps30.total > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {getNPSLabel(metrics.nps30.nps)} • {metrics.nps30.total} respostas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS (90 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getNPSColor(metrics.nps90.nps)}`}>
              {metrics.nps90.total > 0 ? metrics.nps90.nps : '—'}
            </div>
            {metrics.nps90.total > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {getNPSLabel(metrics.nps90.nps)} • {metrics.nps90.total} respostas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tendência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {metrics.trend > 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : metrics.trend < 0 ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <Minus className="w-6 h-6 text-gray-400" />
              )}
              <span className={`text-2xl font-bold ${
                metrics.trend > 0 ? 'text-green-600' : metrics.trend < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metrics.trend > 0 ? '+' : ''}{metrics.trend}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              vs. período anterior
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.alertCount > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {metrics.alertCount > 0 && <AlertTriangle className="w-4 h-4 text-orange-600" />}
              Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metrics.alertCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
              {metrics.alertCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Clientes com NPS ≤ 6
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição */}
      {metrics.npsAll.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Distribuição de Respostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Promotores (9-10)</span>
                <span>{metrics.npsAll.promoters} ({Math.round((metrics.npsAll.promoters / metrics.npsAll.total) * 100)}%)</span>
              </div>
              <Progress 
                value={(metrics.npsAll.promoters / metrics.npsAll.total) * 100} 
                className="h-2 bg-green-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600 font-medium">Neutros (7-8)</span>
                <span>{metrics.npsAll.passives} ({Math.round((metrics.npsAll.passives / metrics.npsAll.total) * 100)}%)</span>
              </div>
              <Progress 
                value={(metrics.npsAll.passives / metrics.npsAll.total) * 100} 
                className="h-2 bg-yellow-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">Detratores (0-6)</span>
                <span>{metrics.npsAll.detractors} ({Math.round((metrics.npsAll.detractors / metrics.npsAll.total) * 100)}%)</span>
              </div>
              <Progress 
                value={(metrics.npsAll.detractors / metrics.npsAll.total) * 100} 
                className="h-2 bg-red-100"
              />
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total de respostas
              </span>
              <span className="font-bold">{metrics.npsAll.total}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NPSMetrics;
