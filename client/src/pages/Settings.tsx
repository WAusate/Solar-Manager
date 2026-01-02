import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie parâmetros globais da plataforma (Apenas Admin).
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferências Gerais</CardTitle>
            <CardDescription>Configurações básicas do dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">Ativar tema escuro para o sistema</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">Receber alertas críticos por email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parâmetros de Alerta</CardTitle>
            <CardDescription>Defina os limiares para geração de alertas automáticos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="efficiency">Eficiência Mínima (%)</Label>
              <Input id="efficiency" defaultValue="75" className="max-w-[200px]" />
              <p className="text-xs text-muted-foreground">Alertar se a eficiência cair abaixo deste valor.</p>
            </div>
            
            <div className="grid gap-2 mt-4">
              <Label htmlFor="downtime">Tempo Offline Máximo (minutos)</Label>
              <Input id="downtime" defaultValue="30" className="max-w-[200px]" />
              <p className="text-xs text-muted-foreground">Alertar se um inversor não responder por este período.</p>
            </div>

            <Button className="mt-4">Salvar Alterações</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
