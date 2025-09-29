import { useState, useEffect } from "react";
import { getTools, createTool, deleteTool } from "../services/toolService";
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
import keycloak from "../keycloak";

export function ToolsManagement({ onNavigate }) {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [form, setForm] = useState({
    name: "",
    category: "",
    rentalPrice: "",
    replacementValue: "",
    stock: "",
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      try {
        const response = await getTools();
        console.log(response);
        setTools(response.data || []);
      } catch (err) {
        setTools([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const validarEstado = (estado) => {
    const estadosPermitidos = ["Disponible", "Prestada", "En reparación", "Dada de baja"];
    return estadosPermitidos.includes(estado) ? estado : "disponible";
  };

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };

  const handleAddTool = async () => {
    if (!form.name?.trim() || !form.category?.trim()) {
      alert("Nombre y categoría son obligatorios");
      return;
    }
    if (!form.replacementValue || isNaN(form.replacementValue)) {
      alert("El valor de reposición es obligatorio y debe ser un número");
      return;
    }

    setAdding(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        replacementValue: Number(form.replacementValue),
        rentalPrice: form.rentalPrice ? Number(form.rentalPrice) : 0,
        stock: form.stock ? parseInt(form.stock) : 0,
        status: validarEstado(form.status || "disponible"),
      };
      console.log("Payload enviado:", payload);

      await createTool(payload);

      setForm({
        name: "",
        category: "",
        replacementValue: "",
        rentalPrice: "",
        stock: "",
        status: ""
      });

      setLoading(true);
      const response = await getTools();
      setTools(response.data || []);
      setLoading(false);
    } catch (err) {
      alert("Error al agregar herramienta: " + (err.response?.data?.message || err.message));
      console.error("Error backend:", err.response?.data);
    } finally {
      setAdding(false);
    }
  };

  // Función para verificar acceso de administrador - CORREGIDA
  const hasAdminAccess = () => {
    try {
      const token = keycloak?.tokenParsed;
      
      if (!token || !keycloak?.authenticated) {
        console.log("❌ Usuario no autenticado");
        return false;
      }

      // Buscar específicamente en el cliente "toolrent-frontend"
      const toolrentFrontendRoles = token?.resource_access?.["toolrent-frontend"]?.roles || [];
      
      // Verificar si tiene el rol "ADMIN" (en mayúsculas como está en Keycloak)
      const hasAdminRole = toolrentFrontendRoles.includes("ADMIN");
      
      console.log("🔍 Verificación de roles admin:", {
        username: token?.preferred_username,
        email: token?.email,
        toolrentFrontendRoles,
        hasAdminRole,
        fullResourceAccess: token?.resource_access
      });

      if (hasAdminRole) {
        console.log("✅ Usuario tiene rol ADMIN en toolrent-frontend");
      } else {
        console.log("❌ Usuario NO tiene rol ADMIN en toolrent-frontend");
      }

      return hasAdminRole;
      
    } catch (error) {
      console.error("❌ Error verificando acceso admin:", error);
      return false;
    }
  };

  // Función para verificar si es empleado (opcional, por si la necesitas después)
  const hasEmployeeAccess = () => {
    try {
      const token = keycloak?.tokenParsed;
      
      if (!token || !keycloak?.authenticated) {
        return false;
      }

      const toolrentFrontendRoles = token?.resource_access?.["toolrent-frontend"]?.roles || [];
      return toolrentFrontendRoles.includes("EMPLEADO");
      
    } catch (error) {
      console.error("Error verificando acceso empleado:", error);
      return false;
    }
  };

  const handleDeleteTool = async (id) => {
    if (!hasAdminAccess()) {
      alert("Solo el administrador puede dar de baja herramientas.");
      return;
    }
    if (!window.confirm("¿Seguro que quieres dar de baja esta herramienta?")) return;
    try {
      await deleteTool(id);
      setLoading(true);
      const response = await getTools();
      setTools(response.data || []);
      setLoading(false);
    } catch (err) {
      alert("Error al dar de baja: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 class="font-sans text-3xl">Gestión de Herramientas</h1>
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
                <Label htmlFor="name">Nombre de la herramienta</Label>
                <Input id="name" value={form.name} onChange={handleInputChange} placeholder="Ej: Taladro Percutor Bosch" />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={form.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Electrica">Electrica</SelectItem>
                    <SelectItem value="Equipo de Seguridad">Equipo de Seguridad</SelectItem>
                    <SelectItem value="Soldadura">Soldadura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentalPrice">Tarifa arriendo/día ($)</Label>
                  <Input id="rentalPrice" type="number" value={form.rentalPrice} onChange={handleInputChange} placeholder="450" />
                </div>
              </div>
              <div>
                <Label htmlFor="replacementValue">Valor de reposición ($)</Label>
                <Input id="replacementValue" type="number" value={form.replacementValue} onChange={handleInputChange} placeholder="85000" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock inicial</Label>
                  <Input id="stock" type="number" value={form.stock} onChange={handleInputChange} placeholder="0" min="0" />
                </div>
              </div>
               <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={form.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="Prestada">Prestada</SelectItem>
                    <SelectItem value="En reparación">En reparación</SelectItem>
                    <SelectItem value="Dada de baja">Dada de baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddTool} disabled={adding}>
                {adding ? "Agregando..." : "Agregar Herramienta"}
              </Button>
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
      {loading ? (
        <div className="text-center py-8">Cargando herramientas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {tool.tool_imageUrl ? (
                    <img
                      src={tool.tool_imageUrl}
                      alt={tool.name}
                      className="object-contain w-full h-full"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                  <Wrench className="h-12 w-12 text-gray-400" />)}
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
                      <span className="text-sm text-muted-foreground">Tarifa arriendo:</span>
                      <span className="font-semibold">
                        ${tool.rentalPrice ? tool.rentalPrice.toLocaleString() : "0"}/día
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor reposición:</span>
                      <span className="font-semibold">
                        ${tool.replacementValue ? tool.replacementValue.toLocaleString() : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      {getStatusBadge(tool.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stock disponible:</span>
                      <span className="font-semibold">{tool.stock} unidades</span>
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
                    {/* Solo muestra el botón "Dar de Baja" si es ADMIN Y la herramienta no está dada de baja */}
                    {tool.status !== "Dada de baja" && hasAdminAccess() && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteTool(tool.id)}
                      >
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
      )}

      {filteredTools.length === 0 && !loading && (
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

      {/* Debug info actualizado */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 text-xs border rounded">
          <strong>🔍 Debug Info:</strong>
          <br />
          Authenticated: {keycloak?.authenticated ? '✅ Sí' : '❌ No'}
          <br />
          Has Admin Access: {hasAdminAccess() ? '✅ Sí' : '❌ No'}
          <br />
          Has Employee Access: {hasEmployeeAccess() ? '✅ Sí' : '❌ No'}
          <br />
          Username: {keycloak?.tokenParsed?.preferred_username || 'No username'}
          <br />
          Email: {keycloak?.tokenParsed?.email || 'No email'}
          <br />
          Toolrent-frontend roles: {JSON.stringify(keycloak?.tokenParsed?.resource_access?.["toolrent-frontend"]?.roles || [])}
          <br />
          <details className="mt-2">
            <summary className="cursor-pointer font-bold">Ver resource_access completo</summary>
            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(keycloak?.tokenParsed?.resource_access, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}