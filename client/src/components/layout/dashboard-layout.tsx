import React, { useState } from "react";
import {
  Scale,
  FileText,
  Users,
  Calendar,
  UserPlus,
  AlertTriangle,
  Building,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/auth-context";
import { Badge } from "../ui/badge";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Scale, roles: ["Funcionário", "Chefe"] },
    { path: "/processos", label: "Processos", icon: FileText, roles: ["Funcionário", "Chefe"] },
    { path: "/documentos", label: "Documentos", icon: FileText, roles: ["Funcionário", "Chefe"] },
    { path: "/reunioes", label: "Reuniões", icon: Calendar, roles: ["Funcionário", "Chefe"] },
    { path: "/envolvidos", label: "Envolvidos", icon: UserPlus, roles: ["Funcionário", "Chefe"] },
    { path: "/queixas", label: "Queixas", icon: AlertTriangle, roles: ["Funcionário", "Chefe"] },
    { path: "/comissoes", label: "Comissões", icon: Building, roles: ["Funcionário", "Chefe"] },
    { path: "/funcionarios", label: "Funcionários", icon: Users, roles: ["Admin"] },
    { path: "/perfil", label: "Perfil", icon: User, roles: ["Funcionário", "Chefe", "Admin"] },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-500";
      case "Chefe":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:flex-shrink-0
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-semibold">SGPJ</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 mt-6 px-4 overflow-y-auto">
            <div className="space-y-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-lg transition-colors
                      ${isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"}
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top navbar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {
                visibleMenuItems.find(
                  (item) => item.path === location.pathname
                )?.label || "Dashboard"
              }
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {user?.nome}
              </span>
              <Badge className={`text-white ${getRoleBadgeColor(user?.role || "")}`}>
                {(user?.role ?? "")
                  .charAt(0)
                  .toUpperCase() + (user?.role ?? "").slice(1)}
              </Badge>

            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
