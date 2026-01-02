import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sun } from "lucide-react";
import { useLocation } from "wouter";
import logo from "@assets/grok-image-deixe_apenas_no_estilo_com_fundo_branco.-9102eb94-c_1767312477482.png";

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const [_, setLocation] = useLocation();
  const [username, setUsername] = useState("cliente@teste.com");
  const [password, setPassword] = useState("client123");
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (user) {
    setLocation(user.role === 'admin' ? '/admin-panel' : '/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login({ username, password }, {
      onError: (err) => setError(err.message)
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl border-white/50 backdrop-blur-sm bg-white/90">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pb-2">
          <div className="w-20 h-20 mb-2 relative">
             <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-display font-bold">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar seu sistema solar
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome@exemplo.com"
                required
                className="h-11 rounded-lg border-slate-200 focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-lg border-slate-200 focus:border-primary focus:ring-primary/20"
              />
            </div>

            <div className="pt-2">
              <div className="text-xs text-muted-foreground bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-semibold mb-1">Credenciais de Teste:</p>
                <div className="flex justify-between mt-1">
                  <span>Cliente:</span>
                  <button type="button" onClick={() => {setUsername('cliente@teste.com'); setPassword('client123')}} className="text-primary hover:underline">cliente@teste.com / client123</button>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Admin:</span>
                  <button type="button" onClick={() => {setUsername('admin@teste.com'); setPassword('admin123')}} className="text-primary hover:underline">admin@teste.com / admin123</button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
