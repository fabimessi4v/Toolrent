import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Filter, 
  Package,
  ArrowUp,
  ArrowDown,
  Wrench,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { getAllKardex } from "../services/kardexService"; // ajusta la ruta si es diferente

export function KardexManagement({ onNavigate }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTool, setSelectedTool] = useState("all");

  useEffect(() => {
    setLoading(true);
    getAllKardex()
      .then(response => {
        setMovements(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener kardex:", error);
        setLoading(false);
      });
  }, []);

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

  // FILTRO actualizado con rango de fechas
  const filteredMovements = movements.filter(m => {
    const matchesSearch =
      (m.toolName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.comments ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.userName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.id ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTool = selectedTool === "all" || m.toolName === selectedTool;

    // Filtrado por rango de fechas
    const movDate = m.movementDate ? new Date(m.movementDate) : null;
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;
    let matchesDate = true;
    if (fromDate && movDate && movDate < fromDate) matchesDate = false;
    if (toDate && movDate && movDate > toDate) matchesDate = false;

    return matchesSearch && matchesTool && matchesDate;
  });

  const uniqueTools = [...new Set(movements.map(m => m.toolName))].map(name => ({ name }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 class="font-sans text-3xl">Kardex y Movimientos</h1>
          <p className="text-muted-foreground">Historial completo de movimientos del inventario</p>
        </div>
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
            {/* Fecha inicio */}
            <Input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-40"
              placeholder="Fecha inicio"
            />
            {/* Fecha fin */}
            <Input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-40"
              placeholder="Fecha fin"
            />
            {/* Herramienta */}
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-64"><Package className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las herramientas</SelectItem>
                {uniqueTools.map(tool => (
                  <SelectItem key={tool.name} value={tool.name}>{tool.name}</SelectItem>
                ))}
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Herramienta</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{m.movementDate}</p>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {getMovementTypeIcon(m.type)}{getMovementTypeBadge(m.type)}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{m.toolName}</p>
                    </TableCell>
                    <TableCell className={`font-semibold ${m.quantity > 0 ? 'text-green-600' : m.quantity < 0 ? 'text-red-600' : 'text-gray-600'}`}>{m.quantity > 0 ? '+' : ''}{m.quantity}</TableCell>
                    <TableCell className="max-w-xs text-sm">{m.comments}</TableCell>
                    <TableCell className="text-sm">{m.userName}</TableCell>
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
              <Button variant="outline" onClick={() => { setSearchTerm(""); setStartDate(""); setEndDate(""); setSelectedTool("all"); }}>Limpiar filtros</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <p>Cargando movimientos...</p>
        </div>
      )}
    </div>
  );
}