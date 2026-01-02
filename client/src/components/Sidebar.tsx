import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FileText,
  AlertCircle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoUrl from "@assets/grok-image-deixe_apenas_no_estilo_com_fundo_branco.-9102eb94-c_1767312477482.png";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["admin", "client"],
    },
    {
      title: "Painel Admin",
      icon: Shield,
      href: "/admin-panel",
      roles: ["admin"],
    },
    {
      title: "Relatórios",
      icon: FileText,
      href: "/reports",
      roles: ["admin", "client"],
    },
    {
      title: "Alertas",
      icon: AlertCircle,
      href: "/alerts",
      roles: ["admin", "client"],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: ["admin"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(user?.role as string)
  );

  return (
    <SidebarUI collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <img src={logoUrl} alt="Gestão Solar" className="h-8 w-8 object-contain" />
          </div>
          {!isCollapsed && (
            <span className="font-display font-bold text-xl text-slate-900 truncate">
              Gestão Solar
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location === item.href}
                tooltip={item.title}
                className={cn(
                  "hover-elevate active-elevate-2",
                  location === item.href && "bg-primary/10 text-primary"
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 px-2 h-12 hover-elevate">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col items-start text-left overflow-hidden">
                  <span className="text-sm font-medium text-slate-900 truncate w-full">
                    {user?.name}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">
                    {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarUI>
  );
}