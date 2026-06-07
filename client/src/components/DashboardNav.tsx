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
  Lock,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const navigationItemsConfig = [
  { labelKey: "navigation.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { labelKey: "navigation.staff", href: "/staff", icon: Users },
  { labelKey: "navigation.children", href: "/children", icon: Baby },
  { labelKey: "navigation.parents", href: "/parents", icon: Users },
  { labelKey: "navigation.rooms", href: "/rooms", icon: Home },
  { labelKey: "navigation.activities", href: "/activities", icon: Calendar },
  { labelKey: "navigation.checkin", href: "/checkin", icon: Clock },
  { labelKey: "navigation.photos", href: "/photos", icon: Image },
  { labelKey: "navigation.reports", href: "/reports", icon: FileText },
  { labelKey: "navigation.payments", href: "/payments", icon: CreditCard },
  { labelKey: "navigation.settings", href: "/settings", icon: Settings },
  { labelKey: "navigation.users", href: "/users", icon: Users },
];

export default function DashboardNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();

  // Filter navigation items based on user role
  const filteredConfig = navigationItemsConfig.filter((item) => {
    // Hide Settings, Users from non-admin users
    if (['/settings', '/users'].includes(item.href)) {
      return user?.role === 'admin';
    }
    return true;
  });

  const navigationItems = filteredConfig.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));

  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    }
  };

  return (
    <div className={`flex h-screen bg-background ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col ${i18n.language === 'ar' ? 'border-r-0 border-l' : ''}`}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-border flex items-center ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <img src="/logo.png" alt="NurseCare" className="w-10 h-10 object-contain" />
            {sidebarOpen && <span className="font-bold text-lg">{t("common.appName")}</span>}
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
                } ${!sidebarOpen && "justify-center"} ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className={`p-4 border-t border-border space-y-3 ${i18n.language === 'ar' ? 'text-right' : ''}`}>
          {sidebarOpen && user && (
            <div className={`px-4 py-3 rounded-lg bg-muted ${i18n.language === 'ar' ? 'text-right' : ''}`}>
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">{user.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className={`w-full ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            <LogOut size={16} />
            {sidebarOpen && t("common.logout")}
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
