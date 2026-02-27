import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useMockKeycloak } from "../auth/MockAuthProvider";
import { getTools, createTool, deleteTool, updateTool } from "../services/serviceWrapper";
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
  Settings
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

// Hook dinámico: usa el real o el mock según el modo
const useAuth = () => {
  const USE_KEYCLOAK = import.meta.env.VITE_USE_KEYCLOAK === 'true';
  if (USE_KEYCLOAK) {
    return useKeycloak();
  } else {
    return useMockKeycloak();
  }
};

export function ToolsManagement({ onNavigate }) {
  const { keycloak } = useAuth();
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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      try {
        const response = await getTools();
        console.log("📦 Tools response:", response);
        let toolsData = [];
        if (Array.isArray(response?.data)) {
          toolsData = response.data;
        } else if (Array.isArray(response)) {
          toolsData = response;
        }
        console.log("✅ Tools data parsed:", toolsData);
        setTools(toolsData);
      } catch (err) {
        console.error("❌ Error fetching tools:", err);
        setTools([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  const categories = ["all", "Manual", "Electrica", "Equipo de Seguridad", "Soldadura"];

  const filteredTools = tools.filter(tool => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (tool.name || '').toLowerCase().includes(searchLower) ||
      (tool.brand || '').toLowerCase().includes(searchLower) ||
      (tool.model || '').toLowerCase().includes(searchLower);
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
      showToast("Nombre y categoría son obligatorios", "error");
      return;
    }
    if (!form.replacementValue || isNaN(form.replacementValue)) {
      showToast("El valor de reposición es obligatorio y debe ser un número", "error");
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

      setForm({ name: "", category: "", replacementValue: "", rentalPrice: "", stock: "", status: "" });
      setAddDialogOpen(false);
      showToast(`Herramienta "${payload.name}" creada exitosamente`);

      setLoading(true);
      const response = await getTools();
      setTools(response.data || []);
      setLoading(false);
    } catch (err) {
      showToast("Error al agregar herramienta: " + (err.response?.data?.message || err.message), "error");
      console.error("Error backend:", err.response?.data);
    } finally {
      setAdding(false);
    }
  };

  const handleEditTool = (tool) => {
    setEditingTool(tool);
    setEditDialogOpen(true);
  };

  const handleUpdateTool = async () => {
    if (!editingTool?.name?.trim() || !editingTool?.category?.trim()) {
      alert("Nombre y categoría son obligatorios");
      return;
    }
    if (!editingTool.replacementValue || isNaN(editingTool.replacementValue)) {
      alert("El valor de reposición es obligatorio y debe ser un número");
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name: editingTool.name.trim(),
        category: editingTool.category.trim(),
        replacementValue: Number(editingTool.replacementValue),
        rentalPrice: editingTool.rentalPrice ? Number(editingTool.rentalPrice) : 0,
        stock: editingTool.stock ? parseInt(editingTool.stock) : 0,
        status: validarEstado(editingTool.status || "Disponible"),
      };
      console.log("Payload actualización:", payload);

      await updateTool(editingTool.id, payload);

      setEditDialogOpen(false);
      setEditingTool(null);

      setLoading(true);
      const response = await getTools();
      setTools(response.data || []);
      setLoading(false);
    } catch (err) {
      alert("Error al actualizar herramienta: " + (err.response?.data?.message || err.message));
      console.error("Error backend:", err.response?.data);
    } finally {
      setUpdating(false);
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
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
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
        <CardContent className="p-4 pt-6">
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
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
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
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-8">Cargando herramientas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Header: ícono pequeño + nombre + badges */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                    <Wrench className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight truncate py-2.5">{tool.name}</h3>
                    {(tool.brand || tool.model) && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {[tool.brand, tool.model].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 ml-4">
                    {getStatusBadge(tool.status)}
                  </div>
                </div>

                {/* Datos en grilla 2 columnas */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t pt-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Tarifa/día</p>
                    <p className="font-semibold">
                      ${tool.rentalPrice ? tool.rentalPrice.toLocaleString("es-CL") : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valor reposición</p>
                    <p className="font-semibold">
                      ${tool.replacementValue ? tool.replacementValue.toLocaleString("es-CL") : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="font-semibold">{tool.stock ?? 0} uds.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Categoría</p>
                    <p className="font-medium truncate">{tool.category || "—"}</p>
                  </div>
                  {tool.location && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Ubicación</p>
                      <p className="text-sm truncate">{tool.location}</p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTool(tool)}>
                    <Edit3 className="h-4 w-4 mr-1.5" />
                    Editar
                  </Button>
                  {tool.status !== "Dada de baja" && hasAdminAccess() && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteTool(tool.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Dar de Baja
                    </Button>
                  )}
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

      {/* Dialog de Edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Herramienta</DialogTitle>
          </DialogHeader>
          {editingTool && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nombre de la herramienta</Label>
                <Input
                  id="edit-name"
                  value={editingTool.name || ""}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  placeholder="Ej: Taladro Percutor Bosch"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Categoría</Label>
                <Select
                  value={editingTool.category || ""}
                  onValueChange={(value) => setEditingTool({ ...editingTool, category: value })}
                >
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
                  <Label htmlFor="edit-rentalPrice">Tarifa arriendo/día ($)</Label>
                  <Input
                    id="edit-rentalPrice"
                    type="number"
                    value={editingTool.rentalPrice || ""}
                    onChange={(e) => setEditingTool({ ...editingTool, rentalPrice: e.target.value })}
                    placeholder="450"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-replacementValue">Valor de reposición ($)</Label>
                <Input
                  id="edit-replacementValue"
                  type="number"
                  value={editingTool.replacementValue || ""}
                  onChange={(e) => setEditingTool({ ...editingTool, replacementValue: e.target.value })}
                  placeholder="85000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingTool.stock || ""}
                    onChange={(e) => setEditingTool({ ...editingTool, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={editingTool.status || ""}
                  onValueChange={(value) => setEditingTool({ ...editingTool, status: value })}
                >
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleUpdateTool} disabled={updating}>
                  {updating ? "Actualizando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "18px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 20px",
            borderRadius: "10px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
            background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
            color: toast.type === "error" ? "#991b1b" : "#166534",
            fontWeight: 500,
            fontSize: "0.92rem",
            minWidth: "260px",
            maxWidth: "420px",
            animation: "slideUp 0.25s ease",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}></span>
          <span>{toast.message}</span>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}