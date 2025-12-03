import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Wrench, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Plus
} from "lucide-react";

export function Dashboard({ onNavigate }) {
  const stats = [
    {
      title: "Herramientas Totales",
      value: "250",
      change: "+12%",
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: "Préstamos Activos",
      value: "23",
      change: "+5%",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Clientes Registrados",
      value: "89",
      change: "+8%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Ingresos del Mes",
      value: "$45,230",
      change: "+15%",
      icon: DollarSign,
      color: "text-emerald-600"
    }
  ];

  const recentLoans = [
    {
      id: "P001",
      tool: "Taladro Percutor Bosch",
      client: "Juan Pérez",
      startDate: "2025-08-26",
      endDate: "2025-08-30",
      status: "Activo",
      amount: "$1,200"
    },
    {
      id: "P002",
      tool: "Sierra Circular Makita",
      client: "María González",
      startDate: "2025-08-25",
      endDate: "2025-08-29",
      status: "Activo",
      amount: "$800"
    },
    {
      id: "P003",
      tool: "Soldadora Lincoln",
      client: "Carlos Ruiz",
      startDate: "2025-08-24",
      endDate: "2025-08-28",
      status: "Vencido",
      amount: "$2,100"
    }
  ];

  const alertItems = [
    {
      message: "Taladro DeWalt requiere mantenimiento",
      type: "warning"
    },
    {
      message: "3 préstamos vencen hoy",
      type: "urgent"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 class="font-sans text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen general del sistema de préstamos
          </p>
        </div>
        <Button onClick={() => onNavigate("loans")} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo Préstamo
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold">{stat.value}</span>
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" aria-hidden="true" />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Loans */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Préstamos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{loan.tool}</span>
                      <Badge
                        variant={
                          loan.status === "Activo"
                            ? "default"
                            : loan.status === "Vencido"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {loan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cliente: {loan.client}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {loan.startDate} - {loan.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{loan.amount}</p>
                    <p className="text-sm text-muted-foreground">#{loan.id}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => onNavigate("loans")}
            >
              Ver Todos los Préstamos
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" aria-hidden="true" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertItems.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === "urgent"
                      ? "bg-red-50 border border-red-200"
                      : "bg-orange-50 border border-orange-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      alert.type === "urgent"
                        ? "text-red-700"
                        : "text-orange-700"
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
