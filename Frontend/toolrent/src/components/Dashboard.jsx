import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Wrench,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  Plus,
  Loader2
} from "lucide-react";
import { getAllLoans, getTools, getAllCustomers, getMonthlyRevenue } from "../services/serviceWrapper";

export function Dashboard({ onNavigate }) {
  const [loans, setLoans] = useState([]);
  const [tools, setTools] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // ── Cargar loans, tools y customers ────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [loansRes, toolsRes, customersRes] = await Promise.allSettled([
          getAllLoans(),
          getTools(),
          getAllCustomers(),
        ]);

        if (loansRes.status === "fulfilled") {
          const d = loansRes.value;
          setLoans(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        }
        if (toolsRes.status === "fulfilled") {
          const d = toolsRes.value;
          setTools(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        }
        if (customersRes.status === "fulfilled") {
          const d = customersRes.value;
          setCustomers(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        }
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Ingresos mensuales desde el backend ─────────────────────────────────
  useEffect(() => {
    async function fetchRevenue() {
      setRevenueLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // JS empieza en 0, backend espera 1-12
        const res = await getMonthlyRevenue(year, month);
        const data = res?.data ?? res;
        // El backend puede devolver { monthlyRevenue: 123 } o directamente un número
        const value =
          typeof data === "number"
            ? data
            : (data?.monthlyRevenue ?? data?.total ?? 0);
        setMonthlyRevenue(value);
      } catch (err) {
        console.error("Error obteniendo ingresos mensuales:", err);
        setMonthlyRevenue(0);
      } finally {
        setRevenueLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  // ── Cálculo de estadísticas ──────────────────────────────────────────────
  const totalTools = tools.reduce((acc, t) => acc + (t.stock ?? 1), 0);
  const activeLoans = loans.filter(
    (l) => l.status === "ACTIVE" || l.status === "Activo"
  ).length;
  const totalCustomers = customers.length;

  const stats = [
    {
      title: "Herramientas Totales",
      value: loading ? "—" : totalTools.toLocaleString("es-CL"),
      isLoading: loading,
      icon: Wrench,
      color: "text-blue-600",
    },
    {
      title: "Préstamos Activos",
      value: loading ? "—" : activeLoans.toLocaleString("es-CL"),
      isLoading: loading,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Clientes Registrados",
      value: loading ? "—" : totalCustomers.toLocaleString("es-CL"),
      isLoading: loading,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Ingresos del Mes",
      value: revenueLoading
        ? "—"
        : `$${(monthlyRevenue ?? 0).toLocaleString("es-CL")}`,
      isLoading: revenueLoading,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  // ── Préstamos recientes: últimos 5 ordenados por fecha de entrega ────────
  const recentLoans = [...loans]
    .sort((a, b) => {
      const dateA = new Date(a.deliveryDate || a.startDate || 0);
      const dateB = new Date(b.deliveryDate || b.startDate || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  const getStatusLabel = (status) => {
    if (status === "ACTIVE" || status === "Activo") return "Activo";
    if (status === "EXPIRED" || status === "Vencido") return "Vencido";
    if (status === "RETURNED" || status === "Devuelto") return "Devuelto";
    return status ?? "—";
  };

  const getBadgeVariant = (status) => {
    const label = getStatusLabel(status);
    if (label === "Activo") return "default";
    if (label === "Vencido") return "destructive";
    return "secondary";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-CL");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-sans text-3xl">Dashboard</h1>
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
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {stat.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="text-2xl font-semibold">{stat.value}</span>
                      )}
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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Recent Loans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Préstamos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando préstamos...
              </div>
            ) : recentLoans.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No hay préstamos registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLoans.map((loan) => {
                  const amount =
                    loan.totalCost ?? loan.totalAmount ?? loan.fine ?? null;
                  return (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">
                            {loan.toolName ?? loan.tool?.name ?? "Herramienta"}
                          </span>
                          <Badge variant={getBadgeVariant(loan.status)}>
                            {getStatusLabel(loan.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cliente:{" "}
                          {loan.customerName ?? loan.customer?.name ?? "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(loan.deliveryDate ?? loan.startDate)} →{" "}
                          {formatDate(loan.dueDate ?? loan.endDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        {amount !== null && amount > 0 ? (
                          <p className="font-semibold">
                            ${amount.toLocaleString("es-CL")}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">—</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          #{loan.id}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => onNavigate("loans")}
            >
              Ver Todos los Préstamos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
