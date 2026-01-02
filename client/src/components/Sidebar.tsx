import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  ShieldCheck, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import logo from "@assets/grok-image-deixe_apenas_no_estilo_com_fundo_branco.-9102eb94-c_1767312477482.png";
import logoIcon from "@assets/logo-icon.png";
import { Sidebar as SidebarBase, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => location === path;

  if (!user) return null;

  return (
    <SidebarBase collapsible="icon" className="border-r border-border shadow-xl shadow-slate-200/50">
      {/* Logo Area */}
      <SidebarHeader className="p-6 flex justify-center items-center border-b border-border/50">
        {isCollapsed ? (
          <img 
            src={logoIcon} 
            alt="Gestão Solar" 
            className="h-10 w-10 object-contain drop-shadow-sm" 
          />
        ) : (
          <img 
            src={logo} 
            alt="Gestão Solar" 
            className="h-20 w-auto object-contain drop-shadow-sm" 
          />
        )}
      </SidebarHeader>

      {/* Toggle Button - Seta na borda */}
      <button
        onClick={toggleSidebar}
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
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          {!isCollapsed && (
            <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Menu Principal
            </div>
          )}
          <SidebarMenu className="space-y-2">
            {user.role === 'client' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                  <Link href="/dashboard" className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
                    isActive("/dashboard") 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}>
                    <LayoutDashboard className="w-5 h-5" />
                    {!isCollapsed && "Dashboard"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {user.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin-panel")} tooltip="Painel Admin">
                  <Link href="/admin-panel" className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
                    isActive("/admin-panel") 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}>
                    <ShieldCheck className="w-5 h-5" />
                    {!isCollapsed && "Painel Admin"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/reports")} tooltip="Relatórios">
                <Link href="/reports" className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
                  isActive("/reports") 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                  isCollapsed && "justify-center"
                )}>
                  <FileText className="w-5 h-5" />
                  {!isCollapsed && "Relatórios"}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/alerts")} tooltip="Alertas">
                <Link href="/alerts" className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
                  isActive("/alerts") 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                  isCollapsed && "justify-center"
                )}>
                  <Bell className="w-5 h-5" />
                  {!isCollapsed && "Alertas"}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Configurações">
                  <Link href="/settings" className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group",
                    isActive("/settings") 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:bg-slate-50 hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}>
                    <Settings className="w-5 h-5" />
                    {!isCollapsed && "Configurações"}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="p-4 border-t border-border/50 bg-slate-50/50">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md relative group">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <button 
              onClick={() => logout()}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-red-50 hover:text-destructive hover:border-red-200 transition-colors shadow-sm relative group"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </SidebarFooter>
    </SidebarBase>
  );
}