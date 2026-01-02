import { useStats } from "@/hooks/use-stats";
import { useAuth } from "@/hooks/use-auth";
import { StatCard } from "@/components/StatCard";
import { Zap, Battery, DollarSign, AlertTriangle, Leaf, Sun } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for the chart
const chartData = [
  { name: 'Seg', generation: 4000 },
  { name: 'Ter', generation: 3000 },
  { name: 'Qua', generation: 2000 },
  { name: 'Qui', generation: 2780 },
  { name: 'Sex', generation: 1890 },
  { name: 'Sáb', generation: 2390 },
  { name: 'Dom', generation: 3490 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return <div className="p-8 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>;
  }

  if (!stats) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Olá, {user?.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Aqui está o resumo da sua geração de energia solar hoje.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Geração Total"
          value={stats.totalGeneration}
          icon={<Zap className="w-6 h-6" />}
          trend="12%"
          trendUp={true}
        />
        <StatCard
          title="Economia Estimada"
          value={stats.savings}
          icon={<DollarSign className="w-6 h-6" />}
          trend="8%"
          trendUp={true}
        />
        <StatCard
          title="Eficiência do Sistema"
          value={stats.efficiency}
          icon={<Sun className="w-6 h-6" />}
        />
        <StatCard
          title="Alertas Ativos"
          value={stats.activeAlerts}
          icon={<AlertTriangle className="w-6 h-6" />}
          className={stats.activeAlerts > 0 ? "border-amber-200 bg-amber-50" : ""}
        />
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="font-display text-xl">Geração de Energia (kWh)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="generation" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPv)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="shadow-sm border-slate-100 bg-gradient-to-br from-green-50 to-emerald-50 border-none">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2 text-emerald-800">
              <Leaf className="w-5 h-5" /> Impacto Ambiental
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-emerald-700 font-medium mb-1">CO2 Evitado</p>
              <p className="text-3xl font-bold text-emerald-900">2.4 ton</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-emerald-700 font-medium mb-1">Árvores Salvas</p>
              <p className="text-3xl font-bold text-emerald-900">125</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-emerald-700 font-medium mb-1">Carros fora da rua</p>
              <p className="text-3xl font-bold text-emerald-900">4</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
