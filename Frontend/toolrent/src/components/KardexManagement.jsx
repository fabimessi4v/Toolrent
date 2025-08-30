import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Filter, 
  Calendar,
  Package,
  ArrowUp,
  ArrowDown,
  Wrench,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function KardexManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTool, setSelectedTool] = useState("all");

  const movements = [
    { id: "M001", date: "2025-08-28", time: "09:30:00", type: "Ingreso", toolId: "T001", toolName: "Taladro Percutor Bosch GSB 120", quantity: 3, previousStock: 0, newStock: 3, description: "Registro inicial de herramienta", registeredBy: "admin", relatedDocument: "Compra #C001" },
    { id: "M002", date: "2025-08-26", time: "09:00:00", type: "Préstamo", toolId: "T001", toolName: "Taladro Percutor Bosch GSB 120", quantity: -1, previousStock: 3, newStock: 2, description: "Préstamo a Juan Pérez", registeredBy: "empleado1", relatedDocument: "Préstamo #P001" },
    { id: "M003", date: "2025-08-25", time: "14:30:00", type: "Préstamo", toolId: "T002", toolName: "Sierra Circular Makita 5007MG", quantity: -1, previousStock: 1, newStock: 0, description: "Préstamo a María González", registeredBy: "empleado1", relatedDocument: "Préstamo #P002" },
    { id: "M004", date: "2025-08-24", time: "16:00:00", type: "Devolución", toolId: "T004", toolName: "Amoladora DeWalt DWE402", quantity: 1, previousStock: 1, newStock: 2, description: "Devolución de Ana López - Estado: Bueno", registeredBy: "empleado2", relatedDocument: "Préstamo #P004" },
    { id: "M005", date: "2025-08-22", time: "11:15:00", type: "Reparación", toolId: "T003", toolName: "Soldadora Lincoln Electric", quantity: 0, previousStock: 1, newStock: 1, description: "Cambio de estado a En reparación", registeredBy: "admin", relatedDocument: "Orden de Trabajo #OT001" },
    { id: "M006", date: "2025-08-20", time: "08:45:00", type: "Baja", toolId: "T005", toolName: "Martillo Demoledor Makita HM1317C", quantity: -1, previousStock: 1, newStock: 0, description: "Baja por daño irreparable - Cliente: Pedro Sánchez", registeredBy: "admin", relatedDocument: "Préstamo #P005" }
  ];

  const getMovementTypeIcon = (type) => {
    switch (type) {
      case "Ingreso": return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "Préstamo": return <ArrowDown className="h-4 w-4 text-blue-600" />;
      case "Devolución": return <ArrowUp className="h-4 w-4 text-blue-600" />;
      case "Reparación": return <Wrench className="h-4 w-4 text-orange-600" />;
      case "Baja": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMovementTypeBadge = (type) => {
    switch (type) {
      case "Ingreso": return <Badge className="bg-green-100 text-green-800">Ingreso</Badge>;
      case "Préstamo": return <Badge className="bg-blue-100 text-blue-800">Préstamo</Badge>;
      case "Devolución": return <Badge className="bg-cyan-100 text-cyan-800">Devolución</Badge>;
      case "Reparación": return <Badge className="bg-orange-100 text-orange-800">Reparación</Badge>;
      case "Baja": return <Badge variant="destructive">Baja</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredMovements = movements.filter(m => {
    const matchesSearch = m.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || m.type === selectedType;
    const matchesTool = selectedTool === "all" || m.toolId === selectedTool;
    return matchesSearch && matchesType && matchesTool;
  });

  const uniqueTools = [...new Set(movements.map(m => ({ id: m.toolId, name: m.toolName })))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Kardex y Movimientos</h1>
          <p className="text-muted-foreground">Historial completo de movimientos del inventario</p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" /> Exportar Reporte
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {["Ingreso", "Préstamo", "Devolución", "Reparación", "Baja"].map((type) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {getMovementTypeIcon(type)}
                <div>
                  <p className="text-sm text-muted-foreground">{type === "Baja" ? "Bajas" : type + "s"}</p>
                  <p className="font-semibold">{movements.filter(m => m.type === type).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar movimientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Ingreso">Ingresos</SelectItem>
                <SelectItem value="Préstamo">Préstamos</SelectItem>
                <SelectItem value="Devolución">Devoluciones</SelectItem>
                <SelectItem value="Reparación">Reparaciones</SelectItem>
                <SelectItem value="Baja">Bajas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-64"><Package className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las herramientas</SelectItem>
                {uniqueTools.map(tool => <SelectItem key={tool.id} value={tool.id}>{tool.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader><CardTitle>Registro de Movimientos</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Herramienta</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Stock Anterior</TableHead>
                  <TableHead>Stock Nuevo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Documento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{m.date}</p>
                        <p className="text-sm text-muted-foreground">{m.time}</p>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">{getMovementTypeIcon(m.type)}{getMovementTypeBadge(m.type)}</TableCell>
                    <TableCell>
                      <p className="font-medium">{m.toolName}</p>
                      <p className="text-sm text-muted-foreground">#{m.toolId}</p>
                    </TableCell>
                    <TableCell className={`font-semibold ${m.quantity > 0 ? 'text-green-600' : m.quantity < 0 ? 'text-red-600' : 'text-gray-600'}`}>{m.quantity > 0 ? '+' : ''}{m.quantity}</TableCell>
                    <TableCell>{m.previousStock}</TableCell>
                    <TableCell className="font-semibold">{m.newStock}</TableCell>
                    <TableCell className="max-w-xs text-sm">{m.description}</TableCell>
                    <TableCell className="text-sm">{m.registeredBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.relatedDocument}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMovements.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No se encontraron movimientos</h3>
              <p className="text-muted-foreground mb-4">No hay movimientos que coincidan con los filtros aplicados.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedType("all"); setSelectedTool("all"); }}>Limpiar filtros</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
