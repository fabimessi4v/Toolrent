import { 
  Home,
  Wrench,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function Sidebar({ currentSection, onNavigate, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, description: "Resumen general" },
    { id: "tools", label: "Herramientas", icon: Wrench, description: "Gestión de inventario" },
    { id: "loans", label: "Préstamos", icon: Calendar, description: "Gestión de préstamos" },
    { id: "clients", label: "Clientes", icon: Users, description: "Gestión de clientes" },
    { id: "kardex", label: "Kardex", icon: FileText, description: "Movimientos de inventario" },
    { id: "reports", label: "Reportes", icon: BarChart3, description: "Análisis y reportes" },
  ];

  // Solo cambia el id de configuración a rates para navegar correctamente
  const bottomMenuItems = [
    { id: "rates", label: "Configuración", icon: Settings, description: "Ajustes del sistema" }
  ];

  return (
    <div className="flex flex-col w-64 fixed lg:static inset-y-0 left-0 z-40">
      <Card className="h-full rounded-none border-l-0 border-t-0 border-b-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">ToolRent Pro</h2>
                <p className="text-sm text-muted-foreground">Gestión de Préstamos</p>
              </div>
            </div>
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
                    onClick={() => onNavigate(item.id)}
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
                // Cambia el isActive para rates
                const isActive = currentSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-auto p-4"
                    onClick={() => onNavigate(item.id)}
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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">JD</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Juan Director</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
              </div>
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
  );
}