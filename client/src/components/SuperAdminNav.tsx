import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Lock, Users, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SuperAdminNav() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
    { label: "Privileges", href: "/super-admin/privileges", icon: Lock },
    { label: "Users", href: "/super-admin/users", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Super Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
