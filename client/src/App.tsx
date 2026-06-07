import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Privileges from "./pages/Privileges";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateNursery from "./pages/CreateNursery";
import EditNursery from "./pages/EditNursery";
import ViewNursery from "./pages/ViewNursery";
import SuperAdminPrivileges from "./pages/SuperAdminPrivileges";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const navigationItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Staff", href: "/staff" },
    { label: "Children", href: "/children" },
    { label: "Parents", href: "/parents" },
    { label: "Rooms", href: "/rooms" },
    { label: "Activities", href: "/activities" },
    { label: "Check-in/Out", href: "/checkin" },
    { label: "Photos", href: "/photos" },
    { label: "Reports", href: "/reports" },
    { label: "Payments", href: "/payments" },
    { label: "Users", href: "/users" },
    { label: "Privileges", href: "/privileges" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-background">
      <DashboardNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Title Row */}
        <div className="px-8 pt-6 pb-4 border-b border-border bg-background flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {navigationItems.find((item) => item.href === location)?.label || "Dashboard"}
          </h1>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-background px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function SuperAdminProtectedRoute({ component: Component }: { component: React.ComponentType }) {
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

  if (user?.role !== "super_admin") {
    window.location.href = "/dashboard";
    return null;
  }

  return <Component />;
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
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/super-admin"} component={() => <SuperAdminProtectedRoute component={SuperAdminDashboard} />} />
      <Route path={"/super-admin/create-nursery"} component={() => <SuperAdminProtectedRoute component={CreateNursery} />} />
      <Route path={"/super-admin/edit-nursery/:id"} component={() => <SuperAdminProtectedRoute component={EditNursery} />} />
      <Route path={"/super-admin/nursery/:id"} component={() => <SuperAdminProtectedRoute component={ViewNursery} />} />
      <Route path={"/super-admin/privileges"} component={() => <SuperAdminProtectedRoute component={SuperAdminPrivileges} />} />
      <Route path={"/super-admin/users"} component={() => <SuperAdminProtectedRoute component={SuperAdminUsers} />} />
      <Route path={"/dashboard"} component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path={"/staff"} component={() => <ProtectedRoute component={Staff} />} />
      <Route path={"/children"} component={() => <ProtectedRoute component={Children} />} />
      <Route path={"/parents"} component={() => <ProtectedRoute component={Parents} />} />
      <Route path={"/rooms"} component={() => <ProtectedRoute component={Rooms} />} />
      <Route path={"/activities"} component={() => <ProtectedRoute component={Activities} />} />
      <Route path={"/checkin"} component={() => <ProtectedRoute component={CheckInOut} />} />
      <Route path={"/photos"} component={() => <ProtectedRoute component={Photos} />} />
      <Route path={"/reports"} component={() => <ProtectedRoute component={Reports} />} />
      <Route path={"/payments"} component={() => <ProtectedRoute component={Payments} />} />
      <Route path={"/users"} component={() => <ProtectedRoute component={Users} />} />
      <Route path={"/privileges"} component={() => <ProtectedRoute component={Privileges} />} />
      <Route path={"/settings"} component={() => <ProtectedRoute component={Settings} />} />
      <Route path={"/404"} component={NotFound} />
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
