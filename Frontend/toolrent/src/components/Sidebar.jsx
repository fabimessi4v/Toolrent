import { 
  Home,
  Wrench,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function Sidebar({ currentSection, onNavigate, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // sidebar oculto en mobile

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, description: "Resumen general" },
    { id: "tools", label: "Herramientas", icon: Wrench, description: "Gestión de inventario" },
    { id: "loans", label: "Préstamos", icon: Calendar, description: "Gestión de préstamos" },
    { id: "clients", label: "Clientes", icon: Users, description: "Gestión de clientes" },
    { id: "kardex", label: "Kardex", icon: FileText, description: "Movimientos de inventario" },
    { id: "reports", label: "Reportes", icon: BarChart3, description: "Análisis y reportes" },
  ];

  const bottomMenuItems = [
    { id: "rates", label: "Configuración", icon: Settings, description: "Ajustes del sistema" }
  ];

  return (
    <>
      {/* Botón para abrir sidebar en móvil */}
      <div className="lg:hidden fixed top-0 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Overlay en móvil */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          flex flex-col w-64 fixed lg:static inset-y-0 left-0 z-40
          transition-transform duration-300 ease-in-out bg-white
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
        onClick={e => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-l-0 border-t-0 border-b-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Wrench className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold">ToolRent Pro</h2>
                  <p className="text-sm text-muted-foreground">Gestión de Préstamos</p>
                </div>
              </div>
              {/* Botón para cerrar sidebar en móvil */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 lg:hidden"
                onClick={() => setIsCollapsed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3 h-auto p-4"
                      onClick={() => {
                        onNavigate(item.id);
                        setIsCollapsed(true); // Cierra el sidebar en mobile tras navegar
                      }}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t">
              <div className="space-y-2 mb-4">
                {bottomMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3 h-auto p-4"
                      onClick={() => {
                        onNavigate(item.id);
                        setIsCollapsed(true);
                      }}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={onLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}