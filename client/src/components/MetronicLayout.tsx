import React, { useState } from "react";
import { useAuth } from "../_core/hooks/useAuth";
import { useRouter } from "wouter";
import { LogOut, Menu, X, Home, Users, Baby, UserCheck, DollarSign, Camera, Settings, BarChart3, Clock } from "lucide-react";

interface MetronicLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const MetronicLayout: React.FC<MetronicLayoutProps> = ({ children, pageTitle = "Dashboard" }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, navigate] = useRouter() as any;

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Staff", path: "/staff" },
    { icon: Baby, label: "Children", path: "/children" },
    { icon: Users, label: "Parents", path: "/parents" },
    { icon: Home, label: "Rooms", path: "/rooms" },
    { icon: Clock, label: "Activities", path: "/activities" },
    { icon: UserCheck, label: "Check-in/Out", path: "/checkin" },
    { icon: DollarSign, label: "Payments", path: "/payments" },
    { icon: Camera, label: "Photos", path: "/photos" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white ${sidebarOpen ? "w-250px" : "w-80px"} transition-all duration-300 min-vh-100 position-fixed start-0 top-0`}
        style={{
          width: sidebarOpen ? "250px" : "80px",
          backgroundColor: "#1a1a2e",
        }}
      >
        {/* Logo */}
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
          {sidebarOpen && <h5 className="mb-0 fw-bold">NurseCare</h5>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-sm btn-light"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-3">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className="d-flex align-items-center px-3 py-2 text-white text-decoration-none hover-bg-secondary transition"
              style={{
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="ms-3 text-nowrap">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen ? "250px" : "80px",
        }}
      >
        {/* Header */}
        <header className="bg-white border-bottom border-light sticky-top">
          <div className="d-flex align-items-center justify-content-between px-4 py-3">
            <h2 className="mb-0 h5 fw-bold text-dark">{pageTitle}</h2>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <a className="dropdown-item" href="/settings">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow-1 p-4 bg-light">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-top border-light py-3 px-4 text-center text-muted small">
          <p className="mb-0">© 2026 NurseCare Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
