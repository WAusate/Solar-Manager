import { useReports } from "@/hooks/use-reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Reports() {
  const { data: reports, isLoading } = useReports();

  if (isLoading) return <div className="p-8">Carregando relatórios...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Relatórios de Geração</h1>
        <p className="text-muted-foreground mt-2">
          Baixe os relatórios mensais de performance e economia.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports?.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-all group border-slate-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{report.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(report.date), "MMMM yyyy", { locale: ptBR })}
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Download className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
