import { useReports } from "@/hooks/use-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp, TrendingDown, CreditCard, Activity, Search, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BillingReport, User } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Reports() {
  const { user } = useAuth();
  const { data: reports, isLoading: reportsLoading } = useReports();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);

  const { data: clients = [] } = useQuery<User[]>({
    queryKey: ["/api/clients"],
    enabled: user?.role === 'admin',
  });

  const { data: billingReports = [], isLoading: billingLoading } = useQuery<(BillingReport & { units: any[], history: any[] })[]>({
    queryKey: ["/api/billing-reports", selectedClientId],
    queryFn: async ({ queryKey }) => {
      const [_key, clientId] = queryKey;
      const url = clientId && clientId !== 'all' ? `/api/billing-reports?userId=${clientId}` : "/api/billing-reports";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch billing reports");
      return res.json();
    }
  });

  const currentMonthReport = billingReports[0];

  if (reportsLoading || billingLoading) return <div className="p-8">Carregando relatórios...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Relatórios de Faturamento</h1>
          <p className="text-muted-foreground mt-2">
            Consulte seu histórico de consumo e injeção de energia.
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-[250px] bg-white border-slate-200">
                <SelectValue placeholder="Selecionar Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </header>

      {/* 1. Card Resumo do Mês Atual */}
      {currentMonthReport && (
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Faturamento - {currentMonthReport.monthYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Energia Injetada</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{currentMonthReport.energiaInjetada} kWh</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Energia Consumida</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-700">{currentMonthReport.energiaConsumida} kWh</span>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Saldo de Crédito</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-secondary">{currentMonthReport.saldoCredito} kWh</span>
                  <CreditCard className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full rounded-xl shadow-lg shadow-primary/20" asChild>
                  <a href={currentMonthReport.pdfUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF Original
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. Gráfico de Barras */}
      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Energia Injetada vs Consumida (13 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentMonthReport?.history ? [...currentMonthReport.history].reverse() : []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey={(d) => `${d.mes}/${d.ano}`} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" />
                <Bar name="Injetada (kWh)" dataKey="energiaInjetada" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar name="Consumida (kWh)" dataKey="energiaConsumida" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Tabela Histórico Detalhado */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground px-1">Histórico Detalhado</h2>
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-700">Mês/Ano</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Consumida</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Injetada</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Compensado</th>
                      <th className="px-6 py-4 font-semibold text-slate-700">Crédito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentMonthReport?.history?.map((h: any) => (
                      <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{h.mes}/{h.ano}</td>
                        <td className="px-6 py-4 text-slate-600">{h.energiaConsumida} kWh</td>
                        <td className="px-6 py-4 text-primary font-medium">{h.energiaInjetada} kWh</td>
                        <td className="px-6 py-4 text-slate-600">{h.kwhCompensado} kWh</td>
                        <td className="px-6 py-4 text-secondary font-medium">{h.creditoGerado} kWh</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Resumo por Unidade Consumidora */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground px-1">Unidades Consumidoras</h2>
          <div className="space-y-4">
            {currentMonthReport?.units?.map((unit: any) => (
              <Card key={unit.id} className="border-none shadow-lg shadow-slate-200/40 hover-elevate cursor-default">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">UC: {unit.codigoCliente}</p>
                      <p className="font-bold text-slate-700">Compensação: {unit.percentualCompensacao}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Saldo</p>
                    <p className="font-bold text-secondary">{unit.saldoCredito} kWh</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
