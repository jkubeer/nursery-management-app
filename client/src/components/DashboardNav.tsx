import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Baby,
  Home,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  X,
  Settings,
  FileText,
  Image,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import LanguageSwitcher from "./LanguageSwitcher";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Staff", href: "/staff", icon: Users },
  { label: "Children", href: "/children", icon: Baby },
  { label: "Parents", href: "/parents", icon: Users },
  { label: "Rooms", href: "/rooms", icon: Home },
  { label: "Activities", href: "/activities", icon: Calendar },
  { label: "Check-in/Out", href: "/checkin", icon: Clock },
  { label: "Photos", href: "/photos", icon: Image },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    const logoutMutation = trpc.auth.logout.useMutation();
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              NC
            </div>
            {sidebarOpen && <span className="font-bold text-lg">NurseCare</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-muted"
                } ${!sidebarOpen && "justify-center"}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-border space-y-3">
          {sidebarOpen && user && (
            <div className="px-4 py-3 rounded-lg bg-muted">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{user.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut size={16} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>

        {/* Language Switcher */}
        <div className="p-4 border-t border-border">
          {sidebarOpen && <LanguageSwitcher />}
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Main Content - Handled by DashboardLayout in App.tsx */}
    </div>
  );
}
