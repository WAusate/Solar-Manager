import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Server, Activity, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";

// Mock data for systems
const systems = [
  { id: 1, name: "Usina Solar Alpha", client: "Cliente Teste", capacity: "50 kWp", status: "online", lastUpdate: "2 min atrás" },
  { id: 2, name: "Residência Silva", client: "João Silva", capacity: "5 kWp", status: "offline", lastUpdate: "1 hora atrás" },
  { id: 3, name: "Fazenda Sol Nascente", client: "Maria Oliveira", capacity: "120 kWp", status: "online", lastUpdate: "5 min atrás" },
  { id: 4, name: "Comércio Central", client: "Pedro Santos", capacity: "15 kWp", status: "warning", lastUpdate: "10 min atrás" },
];

export default function AdminPanel() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-2">Visão geral de todos os sistemas gerenciados.</p>
      </header>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Sistemas"
          value={42}
          icon={<Server className="w-6 h-6" />}
        />
        <StatCard
          title="Clientes Ativos"
          value={38}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Saúde da Rede"
          value="95%"
          icon={<Activity className="w-6 h-6" />}
          className="border-emerald-200 bg-emerald-50"
        />
      </div>

      {/* Systems Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Status das Usinas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Sistema</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((sys) => (
                <TableRow key={sys.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">{sys.name}</TableCell>
                  <TableCell>{sys.client}</TableCell>
                  <TableCell>{sys.capacity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      sys.status === 'online' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      sys.status === 'warning' ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }>
                      {sys.status === 'online' ? 'Online' : sys.status === 'warning' ? 'Alerta' : 'Offline'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{sys.lastUpdate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
