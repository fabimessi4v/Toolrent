import { useState, useEffect } from "react";
import { getAllLoans } from "../services/loansService";
import { getAllCustomersDTO } from "../services/customerService";
import { getToolsRanking } from "../services/toolService"; // <-- Importa el endpoint real
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Filter, Download, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";

export function ReportsManagement({ onNavigate }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("active-loans");

  // Préstamos activos (datos reales)
  const [activeLoans, setActiveLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  // Clientes con atrasos (DTO datos reales)
  const [overdueClients, setOverdueClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Ranking de herramientas (real)
  const [toolRanking, setToolRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  // Efecto para cargar préstamos
  useEffect(() => {
    setLoadingLoans(true);
    getAllLoans()
      .then(response => {
        setActiveLoans(response.data);
        setLoadingLoans(false);
      })
      .catch(error => {
        console.error("Error cargando préstamos:", error);
        setLoadingLoans(false);
      });
  }, []);

  // Efecto para cargar clientes con atrasos (DTO)
  useEffect(() => {
    setLoadingClients(true);
    getAllCustomersDTO()
      .then(response => {
        // Filtra solo clientes con préstamos activos o multas impagas
        const withOverdue = response.data.filter(
          c => Number(c.unpaidFines) > 0 || Number(c.activeLoans) > 0
        );
        setOverdueClients(withOverdue);
        setLoadingClients(false);
      })
      .catch(error => {
        console.error("Error cargando clientes DTO:", error);
        setLoadingClients(false);
      });
  }, []);

  // Efecto para cargar ranking de herramientas (real)
  useEffect(() => {
    setLoadingRanking(true);
    getToolsRanking()
      .then(response => {
        setToolRanking(response.data);
        setLoadingRanking(false);
      })
      .catch(error => {
        console.error("Error cargando ranking:", error);
        setLoadingRanking(false);
      });
  }, []);

  // Filtrado por fecha para préstamos activos y clientes con atrasos (si tienes campo de fecha)
  const filterDataByDate = (data, dateField) => {
    if (!dateFrom && !dateTo) return data;
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">-</Badge>;
    switch (status.toLowerCase()) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Vigente</Badge>;
      case "returned":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Devuelto</Badge>;
      case "late":
        return <Badge variant="destructive">Atrasado</Badge>;
      case "activo":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Activo</Badge>;
      case "restringido":
        return <Badge variant="destructive">Restringido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const exportData = (reportType) => {
    console.log(`Exportando reporte: ${reportType}`);
  };

  // Filtrado por fecha para préstamos activos
  const filteredActiveLoans = filterDataByDate(activeLoans, "deliveryDate");

  // Filtrado por fecha para clientes con atrasos (si tienes algún campo de fecha)
  // Si quieres filtrar clientes por fecha de creación, usa el campo "createdAt". Si no, usa la lista completa.
  const filteredOverdueClients = filterDataByDate(overdueClients, "createdAt");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 class="font-sans text-3xl">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Visualiza estadísticas, genera reportes y analiza el desempeño del sistema
          </p>
        </div>
      </div>

      {/* Filtros de fecha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Fecha Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Fecha Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Limpiar Filtros
            </Button>
            <Button 
              onClick={() => exportData(activeTab)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de reportes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-loans" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Préstamos Activos
          </TabsTrigger>
          <TabsTrigger value="overdue-clients" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Clientes con Atrasos
          </TabsTrigger>
          <TabsTrigger value="tool-ranking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Ranking de Herramientas
          </TabsTrigger>
        </TabsList>

        {/* Préstamos Activos */}
        <TabsContent value="active-loans">
          <Card>
            <CardHeader>
              <CardTitle>Préstamos Activos y su Estado</CardTitle>
              <p className="text-muted-foreground">
                Lista completa de préstamos vigentes y devueltos con detalles de multas
              </p>
            </CardHeader>
            <CardContent>
              {loadingLoans ? (
                <div className="text-center py-8">Cargando préstamos...</div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Herramienta</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha Préstamo</TableHead>
                        <TableHead>Fecha Vencimiento</TableHead>
                        <TableHead>Fecha Devolución</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Multa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActiveLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>{loan.toolName}</TableCell>
                          <TableCell>{loan.customerName}</TableCell>
                          <TableCell>{loan.userName}</TableCell>
                          <TableCell>{formatDate(loan.deliveryDate)}</TableCell>
                          <TableCell>{formatDate(loan.dueDate)}</TableCell>
                          <TableCell>{formatDate(loan.returnDate)}</TableCell>
                          <TableCell>{getStatusBadge(loan.status)}</TableCell>
                          <TableCell>
                            {loan.fine ? (
                              <span className="text-red-600 font-medium">
                                {formatCurrency(loan.fine)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                Total de préstamos: {filteredActiveLoans.length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clientes con Atrasos */}
        <TabsContent value="overdue-clients">
          <Card>
            <CardHeader>
              <CardTitle>Clientes con Atrasos</CardTitle>
              <p className="text-muted-foreground">
                Clientes con préstamos activos o multas impagas
              </p>
            </CardHeader>
            <CardContent>
              {loadingClients ? (
                <div className="text-center py-8">Cargando clientes...</div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Préstamos Totales</TableHead>
                        <TableHead>Préstamos Activos</TableHead>
                        <TableHead>Multas Impagas</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOverdueClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>{getStatusBadge(client.status)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{client.totalLoans}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={client.activeLoans > 0 ? "destructive" : "secondary"}>
                              {client.activeLoans}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {Number(client.unpaidFines) > 0 ? (
                              <Badge variant="destructive">{client.unpaidFines}</Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onNavigate && onNavigate('clients')}
                            >
                              Ver Detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                Total clientes con atrasos: {filteredOverdueClients.length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking de Herramientas */}
        <TabsContent value="tool-ranking">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Herramientas Más Prestadas</CardTitle>
              <p className="text-muted-foreground">
                Análisis de popularidad y rentabilidad de las herramientas del inventario
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                {loadingRanking ? (
                  <div className="text-center py-8">Cargando ranking...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ranking</TableHead>
                        <TableHead>Herramienta</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Total Préstamos</TableHead>
                        <TableHead>Préstamos Activos</TableHead>
                        <TableHead>Ingresos Totales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {toolRanking.map((tool, index) => (
                        <TableRow key={tool.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {index + 1}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>{tool.category}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{tool.totalLoans}</Badge>
                          </TableCell>
                          <TableCell>
                            {tool.activeLoans > 0 ? (
                              <Badge variant="default">{tool.activeLoans}</Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(tool.totalRevenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Total herramientas analizadas: {toolRanking.length} |
                Ingresos totales: {formatCurrency(toolRanking.reduce((sum, tool) => sum + (tool.totalRevenue || 0), 0))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}