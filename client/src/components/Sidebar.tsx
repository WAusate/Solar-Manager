import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  ShieldCheck, 
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import logo from "@assets/grok-image-deixe_apenas_no_estilo_com_fundo_branco.-9102eb94-c_1767312477482.svg";
import logoIcon from "@assets/logo-icon.svg";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => location === path;

  if (!user) return null;

  return (
    <aside className={cn(
      "h-screen bg-white border-r border-border flex flex-col shadow-xl shadow-slate-200/50 transition-all duration-300 relative shrink-0 z-50",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="p-2 flex justify-center items-center border-b border-border/50">
        <div className="relative w-full flex justify-center items-center">
          {isCollapsed ? (
            <img 
              src={logoIcon} 
              alt="Gestão Solar" 
              className="h-10 w-10 object-contain drop-shadow-sm transition-opacity duration-300" 
            />
          ) : (
            <img 
              src={logo} 
              alt="Gestão Solar" 
              className="h-40 w-auto object-contain drop-shadow-sm transition-opacity duration-300" 
            />
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-12 bg-white border border-border rounded-r-lg flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm group z-50"
        aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 whitespace-nowrap overflow-hidden">
            Menu Principal
          </div>
        )}

        {user.role === 'client' && (
          <Link href="/dashboard" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
            isActive("/dashboard") 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Dashboard</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
                Dashboard
              </span>
            )}
          </Link>
        )}

        {user.role === 'admin' && (
          <>
            <Link href="/admin-panel" className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
              isActive("/admin-panel") 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}>
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Painel Admin</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
                  Painel Admin
                </span>
              )}
            </Link>

            <Link href="/clients" className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
              isActive("/clients") 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}>
              <Users className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Clientes</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
                  Clientes
                </span>
              )}
            </Link>
          </>
        )}

        <Link href="/reports" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
          isActive("/reports") 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
          isCollapsed && "justify-center px-0"
        )}>
          <FileText className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Relatórios</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
              Relatórios
            </span>
          )}
        </Link>

        <Link href="/alerts" className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
          isActive("/alerts") 
            ? "bg-primary/10 text-primary shadow-sm" 
            : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
          isCollapsed && "justify-center px-0"
        )}>
          <Bell className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Alertas</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
              Alertas
            </span>
          )}
        </Link>

        {user.role === 'admin' && (
          <Link href="/settings" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
            isActive("/settings") 
              ? "bg-primary/10 text-primary shadow-sm" 
              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}>
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate opacity-100 transition-opacity duration-200">Configurações</span>}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
                Configurações
              </span>
            )}
          </Link>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/50 bg-slate-50/50">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed ? "flex-col" : "px-2 mb-3"
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => logout()}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border border-border bg-white hover:bg-red-50 hover:text-destructive hover:border-red-200 transition-all duration-200 text-sm font-medium shadow-sm relative group",
            isCollapsed ? "w-10 h-10 mx-auto mt-2" : "w-full py-2"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sair</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-[60]">
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}