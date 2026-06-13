import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Home, FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

const ParentNav = () => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const navigationItems = [
    { label: "Dashboard", href: "/parent-dashboard", icon: Home },
    { label: "My Children", href: "/parent-children", icon: Home },
    { label: "Payments", href: "/parent-payments", icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col h-screen shadow-lg">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="font-bold text-blue-600">NC</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">NurseCare</h1>
            <p className="text-xs text-blue-100">Parent Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-blue-400 space-y-4">
        <div className="px-4 py-3 bg-blue-500 rounded-lg">
          <p className="text-xs text-white">Logged in as</p>
          <p className="font-semibold truncate text-white">{user?.name || user?.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Dashboard", href: "/parent-dashboard" },
    { label: "My Children", href: "/parent-children" },
    { label: "Payments", href: "/parent-payments" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ParentNav />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="font-bold text-blue-600 text-sm">NC</span>
            </div>
            <span className="font-bold">NurseCare</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-blue-500 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-600 text-white p-4 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 rounded hover:bg-blue-500"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Page Title & Date */}
        <div className="px-8 pt-6 pb-4 border-b border-border bg-background flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            {navigationItems.find((item) => item.href === location)?.label || "Parent Portal"}
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
