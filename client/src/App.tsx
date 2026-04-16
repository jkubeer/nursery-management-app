import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardNav from "./components/DashboardNav";
import Staff from "./pages/Staff";
import Children from "./pages/Children";
import Parents from "./pages/Parents";
import Rooms from "./pages/Rooms";
import Activities from "./pages/Activities";
import CheckInOut from "./pages/CheckInOut";
import Payments from "./pages/Payments";
import Photos from "./pages/Photos";
import Reports from "./pages/Reports";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8 bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path={"/staff"} component={() => <ProtectedRoute component={Staff} />} />
      <Route path={"/children"} component={() => <ProtectedRoute component={Children} />} />
      <Route path={"/parents"} component={() => <ProtectedRoute component={Parents} />} />
      <Route path={"/rooms"} component={() => <ProtectedRoute component={Rooms} />} />
      <Route path={"/activities"} component={() => <ProtectedRoute component={Activities} />} />
       <Route path={"checkin"} component={() => <ProtectedRoute component={CheckInOut} />} />
      <Route path={"photos"} component={() => <ProtectedRoute component={Photos} />} />
      <Route path={"reports"} component={() => <ProtectedRoute component={Reports} />} />
      <Route path={"payments"} component={() => <ProtectedRoute component={Payments} />} />
      <Route path={"404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
