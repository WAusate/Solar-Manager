import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AdminPanel from "@/pages/AdminPanel";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";

// Protected Route Component
function ProtectedRoute({ 
  component: Component, 
  allowedRoles 
}: { 
  component: React.ComponentType<any>, 
  allowedRoles?: ('admin' | 'client')[] 
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Component />
        </main>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route path="/">
        {params => <Redirect to="/login" />}
      </Route>

      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} allowedRoles={['client', 'admin']} />
      </Route>

      <Route path="/admin-panel">
        <ProtectedRoute component={AdminPanel} allowedRoles={['admin']} />
      </Route>

      <Route path="/alerts">
        <ProtectedRoute component={Alerts} />
      </Route>

      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={Settings} allowedRoles={['admin']} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;