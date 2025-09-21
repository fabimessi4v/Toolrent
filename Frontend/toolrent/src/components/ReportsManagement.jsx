import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Download, Filter, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";

export function ReportsManagement({ onNavigate }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("active-loans");

  // Mock data - RF6.1: Préstamos activos
  const mockActiveLoans = [
    {
      id: "L001",
      clientName: "Juan Pérez",
      clientRut: "12.345.678-9",
      toolName: "Taladro Bosch Professional",
      loanDate: "2024-01-15",
      returnDate: "2024-01-20",
      status: "atrasado",
      daysOverdue: 5,
      dailyRate: 5000,
      penalty: 2500
    },
    {
      id: "L002", 
      clientName: "María González",
      clientRut: "98.765.432-1",
      toolName: "Sierra Circular Makita",
      loanDate: "2024-01-18",
      returnDate: "2024-01-25",
      status: "vigente",
      dailyRate: 8000
    },
    {
      id: "L003",
      clientName: "Carlos Silva",
      clientRut: "11.222.333-4",
      toolName: "Amoladora Angular",
      loanDate: "2024-01-10",
      returnDate: "2024-01-17",
      status: "atrasado",
      daysOverdue: 8,
      dailyRate: 4000,
      penalty: 3200
    },
    {
      id: "L004",
      clientName: "Ana López",
      clientRut: "55.666.777-8",
      toolName: "Martillo Demoledor",
      loanDate: "2024-01-19",
      returnDate: "2024-01-26",
      status: "vigente",
      dailyRate: 12000
    },
    {
      id: "L005",
      clientName: "Roberto Martinez",
      clientRut: "44.555.666-7",
      toolName: "Nivel Láser",
      loanDate: "2024-01-12",
      returnDate: "2024-01-19",
      status: "atrasado",
      daysOverdue: 3,
      dailyRate: 6000,
      penalty: 1800
    }
  ];

  // Mock data - RF6.2: Clientes con atrasos
  const mockClientsWithOverdue = [
    {
      id: "C001",
      name: "Juan Pérez",
      rut: "12.345.678-9",
      phone: "+56 9 1234 5678",
      email: "juan.perez@email.com",
      overdueLoans: 1,
      totalPenalty: 2500,
      oldestOverdueDate: "2024-01-15",
      status: "restringido"
    },
    {
      id: "C003",
      name: "Carlos Silva", 
      rut: "11.222.333-4",
      phone: "+56 9 8765 4321",
      email: "carlos.silva@email.com",
      overdueLoans: 2,
      totalPenalty: 4500,
      oldestOverdueDate: "2024-01-10",
      status: "restringido"
    },
    {
      id: "C005",
      name: "Roberto Martinez",
      rut: "44.555.666-7",
      phone: "+56 9 5555 7777",
      email: "roberto.martinez@email.com",
      overdueLoans: 1,
      totalPenalty: 1800,
      oldestOverdueDate: "2024-01-12",
      status: "activo"
    }
  ];

  // Mock data - RF6.3: Ranking de herramientas más prestadas
  const mockToolRanking = [
    {
      id: "T001",
      toolName: "Taladro Bosch Professional",
      category: "Herramientas Eléctricas",
      totalLoans: 45,
      activeLoans: 3,
      totalRevenue: 225000,
      averageLoanDays: 4.2,
      popularityScore: 95
    },
    {
      id: "T002",
      toolName: "Sierra Circular Makita",
      category: "Herramientas de Corte",
      totalLoans: 38,
      activeLoans: 2,
      totalRevenue: 304000,
      averageLoanDays: 5.1,
      popularityScore: 88
    },
    {
      id: "T003",
      toolName: "Martillo Demoledor",
      category: "Herramientas Pesadas",
      totalLoans: 32,
      activeLoans: 1,
      totalRevenue: 384000,
      averageLoanDays: 3.8,
      popularityScore: 82
    },
    {
      id: "T004",
      toolName: "Amoladora Angular",
      category: "Herramientas Eléctricas",
      totalLoans: 28,
      activeLoans: 2,
      totalRevenue: 112000,
      averageLoanDays: 3.2,
      popularityScore: 75
    },
    {
      id: "T005",
      toolName: "Nivel Láser",
      category: "Instrumentos de Medición",
      totalLoans: 25,
      activeLoans: 1,
      totalRevenue: 150000,
      averageLoanDays: 4.8,
      popularityScore: 68
    },
    {
      id: "T006",
      toolName: "Soldadora Inverter",
      category: "Equipos de Soldadura",
      totalLoans: 22,
      activeLoans: 0,
      totalRevenue: 264000,
      averageLoanDays: 6.2,
      popularityScore: 62
    }
  ];

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
    switch (status) {
      case "vigente":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Vigente</Badge>;
      case "atrasado":
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
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const exportData = (reportType) => {
    // Implementación básica de exportación
    console.log(`Exportando reporte: ${reportType}`);
    // Aquí se implementaría la lógica real de exportación a Excel/PDF
  };

  const filteredActiveLoans = filterDataByDate(mockActiveLoans, 'loanDate');
  const filteredClientsWithOverdue = filterDataByDate(mockClientsWithOverdue, 'oldestOverdueDate');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>Reportes y Análisis</h1>
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

        {/* RF6.1: Préstamos Activos */}
        <TabsContent value="active-loans">
          <Card>
            <CardHeader>
              <CardTitle>Préstamos Activos y su Estado</CardTitle>
              <p className="text-muted-foreground">
                Lista completa de préstamos vigentes y atrasados con detalles de multas
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Herramienta</TableHead>
                      <TableHead>Fecha Préstamo</TableHead>
                      <TableHead>Fecha Devolución</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Días Atraso</TableHead>
                      <TableHead>Tarifa Diaria</TableHead>
                      <TableHead>Multa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActiveLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.id}</TableCell>
                        <TableCell>
                          <div>
                            <div>{loan.clientName}</div>
                            <div className="text-sm text-muted-foreground">{loan.clientRut}</div>
                          </div>
                        </TableCell>
                        <TableCell>{loan.toolName}</TableCell>
                        <TableCell>{formatDate(loan.loanDate)}</TableCell>
                        <TableCell>{formatDate(loan.returnDate)}</TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                        <TableCell>
                          {loan.daysOverdue ? (
                            <span className="text-red-600 font-medium">
                              {loan.daysOverdue} días
                            </span>
                          ) : (
                            <span className="text-green-600">-</span>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(loan.dailyRate)}</TableCell>
                        <TableCell>
                          {loan.penalty ? (
                            <span className="text-red-600 font-medium">
                              {formatCurrency(loan.penalty)}
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
              <div className="mt-4 text-sm text-muted-foreground">
                Total de préstamos: {filteredActiveLoans.length} | 
                Atrasados: {filteredActiveLoans.filter(l => l.status === 'atrasado').length} |
                Vigentes: {filteredActiveLoans.filter(l => l.status === 'vigente').length}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RF6.2: Clientes con Atrasos */}
        <TabsContent value="overdue-clients">
          <Card>
            <CardHeader>
              <CardTitle>Clientes con Atrasos</CardTitle>
              <p className="text-muted-foreground">
                Lista de clientes que tienen préstamos atrasados y sus multas acumuladas
              </p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Préstamos Atrasados</TableHead>
                      <TableHead>Multa Total</TableHead>
                      <TableHead>Atraso Más Antiguo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientsWithOverdue.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.rut}</TableCell>
                        <TableCell>
                          <div>
                            <div>{client.phone}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{client.overdueLoans}</Badge>
                        </TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {formatCurrency(client.totalPenalty)}
                        </TableCell>
                        <TableCell>{formatDate(client.oldestOverdueDate)}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onNavigate('clients')}
                          >
                            Ver Detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Total clientes con atrasos: {filteredClientsWithOverdue.length} |
                Multas acumuladas: {formatCurrency(filteredClientsWithOverdue.reduce((sum, client) => sum + client.totalPenalty, 0))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RF6.3: Ranking de Herramientas */}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Herramienta</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Total Préstamos</TableHead>
                      <TableHead>Préstamos Activos</TableHead>
                      <TableHead>Ingresos Totales</TableHead>
                      <TableHead>Promedio Días</TableHead>
                      <TableHead>Score Popularidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockToolRanking.map((tool, index) => (
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
                        <TableCell className="font-medium">{tool.toolName}</TableCell>
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
                        <TableCell>{tool.averageLoanDays} días</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${tool.popularityScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{tool.popularityScore}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Total herramientas analizadas: {mockToolRanking.length} |
                Ingresos totales: {formatCurrency(mockToolRanking.reduce((sum, tool) => sum + tool.totalRevenue, 0))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}