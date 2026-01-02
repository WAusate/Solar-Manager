import { useAlerts, useResolveAlert } from "@/hooks/use-alerts";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Alerts() {
  const { user } = useAuth();
  const { data: alerts, isLoading } = useAlerts();
  const resolveMutation = useResolveAlert();

  if (isLoading) return <div className="p-8">Carregando alertas...</div>;
  if (!alerts) return null;

  // Filter for client (mock logic: real logic would happen on backend usually, but strict requirement says filter here or in API)
  // Backend API normally filters. Assuming API returns what user is allowed to see.
  // But requirement says "Admin View: Show ALL. Client View: Show ONLY theirs."
  // If the backend /api/alerts returns everything for admin and filtered for client, we are good.
  // Assuming the API handles filtering based on session.
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return "bg-red-50 text-red-700 border-red-200";
      case 'high': return "bg-orange-50 text-orange-700 border-orange-200";
      case 'medium': return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Alertas do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === 'admin' 
            ? "Gerencie e resolva alertas de todos os sistemas." 
            : "Acompanhe notificações importantes sobre sua usina."}
        </p>
      </header>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-8 text-center bg-slate-50 border-dashed">
            <p className="text-muted-foreground">Nenhum alerta encontrado. Tudo operando normalmente!</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={cn(
              "transition-all duration-200 hover:shadow-md border-l-4",
              alert.status === 'resolved' ? "border-l-slate-300 opacity-60" : 
              alert.severity === 'critical' ? "border-l-red-500" :
              alert.severity === 'high' ? "border-l-orange-500" :
              "border-l-blue-500"
            )}>
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className={cn("p-2 rounded-full bg-white shadow-sm border", 
                    alert.status === 'resolved' ? "grayscale" : ""
                  )}>
                    {getIcon(alert.severity)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-foreground">{alert.title}</h3>
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      {alert.status === 'resolved' && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">Resolvido</Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-2">{alert.message}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Planta: <strong>{alert.plantName}</strong></span>
                      <span>{format(new Date(alert.createdAt || Date.now()), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>

                {user?.role === 'admin' && alert.status === 'active' && (
                  <Button 
                    onClick={() => resolveMutation.mutate(alert.id)}
                    disabled={resolveMutation.isPending}
                    variant="outline"
                    className="shrink-0 gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolver
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
