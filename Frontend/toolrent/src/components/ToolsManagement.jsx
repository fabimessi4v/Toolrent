import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  Wrench,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export function ToolsManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const tools = [
    {
      id: "T001",
      name: "Taladro Percutor Bosch GSB 120",
      category: "Taladros",
      brand: "Bosch",
      model: "GSB 120",
      status: "Disponible",
      stock: 3,
      dailyRentalRate: 450,
      dailyFineRate: 45,
      replacementValue: 85000,
      location: "Bodega A - Sector 2",
      registrationDate: "2025-01-15",
      registeredBy: "admin",
      condition: "excelente"
    },
    {
      id: "T002",
      name: "Sierra Circular Makita 5007MG",
      category: "Sierras",
      brand: "Makita",
      model: "5007MG",
      status: "Prestada",
      stock: 0,
      dailyRentalRate: 380,
      dailyFineRate: 38,
      replacementValue: 65000,
      location: "Prestada a Juan Pérez",
      registrationDate: "2025-01-20",
      registeredBy: "admin",
      condition: "bueno"
    },
    {
      id: "T003",
      name: "Soldadora Lincoln Electric",
      category: "Soldadoras",
      brand: "Lincoln",
      model: "AC-225",
      status: "En reparación",
      stock: 1,
      dailyRentalRate: 750,
      dailyFineRate: 75,
      replacementValue: 150000,
      location: "Taller de Reparación",
      registrationDate: "2025-02-01",
      registeredBy: "admin",
      condition: "regular"
    },
    {
      id: "T004",
      name: "Amoladora DeWalt DWE402",
      category: "Amoladoras",
      brand: "DeWalt",
      model: "DWE402",
      status: "Disponible",
      stock: 2,
      dailyRentalRate: 280,
      dailyFineRate: 28,
      replacementValue: 45000,
      location: "Bodega B - Sector 1",
      registrationDate: "2025-02-10",
      registeredBy: "admin",
      condition: "excelente"
    },
    {
      id: "T005",
      name: "Martillo Demoledor Makita HM1317C",
      category: "Martillos",
      brand: "Makita",
      model: "HM1317C",
      status: "Dada de baja",
      stock: 0,
      dailyRentalRate: 600,
      dailyFineRate: 60,
      replacementValue: 120000,
      location: "Dada de baja por daño irreparable",
      registrationDate: "2024-12-01",
      registeredBy: "admin",
      condition: "malo"
    }
  ];

  const categories = ["all", "Taladros", "Sierras", "Soldadoras", "Amoladoras", "Llaves", "Martillos"];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponible":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case "Prestada":
        return <Badge className="bg-blue-100 text-blue-800">Prestada</Badge>;
      case "En reparación":
        return <Badge className="bg-orange-100 text-orange-800">En reparación</Badge>;
      case "Dada de baja":
        return <Badge variant="destructive">Dada de baja</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition) {
      case "excelente":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "bueno":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "regular":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Herramientas</h1>
          <p className="text-muted-foreground">
            Administra tu inventario de herramientas
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Herramienta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Herramienta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tool-name">Nombre de la herramienta</Label>
                <Input id="tool-name" placeholder="Ej: Taladro Percutor Bosch" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Bosch" />
                </div>
                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="GSB 120" />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taladros">Taladros</SelectItem>
                    <SelectItem value="sierras">Sierras</SelectItem>
                    <SelectItem value="soldadoras">Soldadoras</SelectItem>
                    <SelectItem value="amoladoras">Amoladoras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rental-rate">Tarifa arriendo/día ($)</Label>
                  <Input id="rental-rate" type="number" placeholder="450" />
                </div>
                <div>
                  <Label htmlFor="fine-rate">Tarifa multa/día ($)</Label>
                  <Input id="fine-rate" type="number" placeholder="45" />
                </div>
              </div>
              <div>
                <Label htmlFor="replacement-value">Valor de reposición ($)</Label>
                <Input id="replacement-value" type="number" placeholder="85000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock inicial</Label>
                  <Input id="stock" type="number" placeholder="1" min="1" />
                </div>
                <div>
                  <Label htmlFor="location">Ubicación</Label>
                  <Input id="location" placeholder="Bodega A - Sector 1" />
                </div>
              </div>
              <Button className="w-full">Agregar Herramienta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar herramientas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <Wrench className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.brand} - {tool.model}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getConditionIcon(tool.condition)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    {getStatusBadge(tool.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Stock disponible:</span>
                    <span className="font-semibold">{tool.stock} unidades</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tarifa arriendo:</span>
                    <span className="font-semibold">${tool.dailyRentalRate.toLocaleString()}/día</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor reposición:</span>
                    <span className="font-semibold">${tool.replacementValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ubicación:</span>
                    <span className="text-sm">{tool.location}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  {tool.status !== "Dada de baja" && (
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Dar de Baja
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Kardex
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No se encontraron herramientas</h3>
            <p className="text-muted-foreground mb-4">
              No hay herramientas que coincidan con tu búsqueda.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}>
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
