import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  ShieldCheck, 
  LogOut
} from "lucide-react";
import logo from "@assets/grok-image-deixe_apenas_no_estilo_com_fundo_branco.-9102eb94-c_1767312477482.png";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  if (!user) return null;

  return (
    <div className="h-screen w-64 bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50 shadow-xl shadow-slate-200/50">
      {/* Logo Area */}
      <div className="p-6 flex justify-center border-b border-border/50">
        <img 
          src={logo} 
          alt="Gestão Solar" 
          className="h-20 w-auto object-contain drop-shadow-sm" 
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu Principal
        </div>

        {user.role === 'client' && (
          <Link href="/dashboard" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
            isActive("/dashboard") 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
          )}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
        )}

        {user.role === 'admin' && (
          <Link href="/admin-panel" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
            isActive("/admin-panel") 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
          )}>
            <ShieldCheck className="w-5 h-5" />
            Painel Admin
          </Link>
        )}

        <Link href="/reports" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
          isActive("/reports") 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
        )}>
          <FileText className="w-5 h-5" />
          Relatórios
        </Link>

        <Link href="/alerts" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
          isActive("/alerts") 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
        )}>
          <Bell className="w-5 h-5" />
          Alertas
        </Link>

        {user.role === 'admin' && (
          <Link href="/settings" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
            isActive("/settings") 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
          )}>
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/50 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-white hover:bg-red-50 hover:text-destructive hover:border-red-200 transition-colors text-sm font-medium shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}