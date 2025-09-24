import { useEffect, useState } from "react";
import { 
  Card, CardContent
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, Plus, Filter, Calendar, User,
  Clock, DollarSign, AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getAllLoans, createLoan, returnLoan } from "../services/loansService.js"; // <--- importar returnLoan
import { getTools } from "../services/toolService.js";
import { getAllCustomers } from "../services/customerService.js";
import keycloak from "../keycloak";

// Helper para formatear fecha
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function LoansManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({
    clientId: "",
    toolId: "",
    startDate: "",
    endDate: "",
    notes: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tools, setTools] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    getTools().then(response => {
      setTools(response.data);
    });
    getAllCustomers()
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error("Error clientes:", error);
      });
    fetchLoans();
  }, []);

  // Nueva función para recargar los préstamos tras devolución
  const fetchLoans = () => {
    getAllLoans()
      .then(response => {
        setLoans(response.data);
      })
      .catch(error => {
        console.error("Error préstamos:", error);
      });
  };

  const getStatusBadge = (status) => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-blue-100 text-blue-800">Activo</Badge>;
      case "EXPIRED":
      case "VENCIDO":
        return <Badge variant="destructive">Vencido</Badge>;
      case "RETURNED":
      case "DEVUELTO":
        return <Badge className="bg-green-100 text-green-800">Devuelto</Badge>;
      case "CANCELLED":
      case "CANCELADO":
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "EXPIRED":
      case "VENCIDO":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "RETURNED":
      case "DEVUELTO":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "CANCELLED":
      case "CANCELADO":
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filtrado para búsqueda y estado
  const filteredLoans = loans.filter(loan => {
    const matchesSearch =
      (loan.customerName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.toolName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loan.id ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      loan.status?.toUpperCase() === selectedStatus.toUpperCase() ||
      (selectedStatus === "Vencido" && loan.status?.toUpperCase() === "EXPIRED") ||
      (selectedStatus === "Devuelto" && loan.status?.toUpperCase() === "RETURNED") ||
      (selectedStatus === "Activo" && loan.status?.toUpperCase() === "ACTIVE");
    return matchesSearch && matchesStatus;
  });

  // Para estadísticas rápidas
  const activeLoans = loans.filter(l => l.status?.toUpperCase() === "ACTIVE");
  const overdueLoans = loans.filter(l => l.status?.toUpperCase() === "EXPIRED" || l.status?.toUpperCase() === "VENCIDO");
  const returnedLoans = loans.filter(l => l.status?.toUpperCase() === "RETURNED" || l.status?.toUpperCase() === "DEVUELTO");

  // Maneja cambios en el formulario
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Crear préstamo llamando al backend
 // Crear préstamo llamando al backend
const handleCreateLoan = async () => {
  if (!form.clientId || !form.toolId || !form.startDate || !form.endDate) {
    alert("Completa todos los campos requeridos.");
    return;
  }
  setCreating(true);

  try {
    const payload = {
      toolId: form.toolId,
      customerId: form.clientId,
      deliveryDate: form.startDate,
      dueDate: form.endDate
    };
    await createLoan(payload);
    alert("Préstamo creado con éxito");
    // En lugar de añadir la respuesta, recargamos la lista completa
    fetchLoans();
    setDialogOpen(false);
    setForm({ clientId: "", toolId: "", startDate: "", endDate: "", notes: "" });
  } catch (e) {
    alert("Error al crear préstamo: " + (e.response?.data || e.message));
  } finally {
    setCreating(false);
  }
};
  // Acción para devolver préstamo
 // Acción para devolver préstamo
const handleReturnLoan = async (loanId) => {
  try {
    const response = await returnLoan(loanId);
    const loanDevuelto = response.data;
    
    // Mensaje personalizado basado en si hay multa o no
    if (loanDevuelto.fine && loanDevuelto.fine > 0) {
      alert(`Préstamo devuelto correctamente.\nMulta por atraso: $${loanDevuelto.fine.toLocaleString()}`);
    } else {
      alert("Préstamo devuelto correctamente. No hay multa.");
    }
    
    fetchLoans(); // Recargar la lista actualizada
  } catch (e) {
    alert("Error al devolver préstamo: " + 
      (typeof e.response?.data === "string"
        ? e.response.data
        : e.response?.data?.message || e.message));
  }
};

  if (!keycloak?.authenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Debes iniciar sesión</h2>
        <p>Por favor, inicia sesión para gestionar préstamos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 class="font-sans text-3xl">Gestión de Préstamos</h1>
          <p className="text-muted-foreground">Administra todos los préstamos de herramientas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Préstamo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nuevo Préstamo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-select">Cliente</Label>
                <Select value={form.clientId} onValueChange={v => handleFormChange("clientId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tool-select">Herramienta</Label>
                <Select value={form.toolId} onValueChange={v => handleFormChange("toolId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar herramienta" />
                  </SelectTrigger>
                  <SelectContent>
                    {tools.map(tool => (
                      <SelectItem key={tool.id} value={tool.id}>
                        {tool.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Fecha inicio</Label>
                  <Input id="start-date" type="date" value={form.startDate} onChange={e => handleFormChange("startDate", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="end-date">Fecha fin</Label>
                  <Input id="end-date" type="date" value={form.endDate} onChange={e => handleFormChange("endDate", e.target.value)} />
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium mb-2">Validaciones automáticas:</p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Cliente debe estar en estado Activo</li>
                  <li>• Sin préstamos vencidos ni multas impagas</li>
                  <li>• Herramienta debe tener stock ≥ 1</li>
                  <li>• Máximo 5 préstamos activos por cliente</li>
                </ul>
              </div>
              <div>
                <Label htmlFor="notes">Notas adicionales</Label>
                <Input id="notes" value={form.notes} onChange={e => handleFormChange("notes", e.target.value)} placeholder="Observaciones del préstamo..." />
              </div>
              <Button className="w-full" onClick={handleCreateLoan} disabled={creating}>
                {creating ? "Creando..." : "Crear Préstamo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Préstamos Activos</p>
                <p className="text-2xl font-semibold">{activeLoans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Préstamos Vencidos</p>
                <p className="text-2xl font-semibold">{overdueLoans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Devueltos</p>
                <p className="text-2xl font-semibold">{returnedLoans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="Activo">Activos</TabsTrigger>
          <TabsTrigger value="Vencido">Vencidos</TabsTrigger>
          <TabsTrigger value="Devuelto">Devueltos</TabsTrigger>
        </TabsList>

        {/* Todos los préstamos */}
        <TabsContent value="all">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por cliente, herramienta o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="Activo">Activos</SelectItem>
                    <SelectItem value="Vencido">Vencidos</SelectItem>
                    <SelectItem value="Devuelto">Devueltos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Loans List */}
          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(loan.status)}
                        <h3 className="font-semibold">{loan.toolName}</h3>
                        {getStatusBadge(loan.status)}
                        <span className="text-xs text-muted-foreground">#{loan.id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{loan.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              <span className="font-normal text-muted-foreground">Desde:</span> {formatDate(loan.deliveryDate)}
                              <br/>
                              <span className="font-normal text-muted-foreground">Hasta:</span> {formatDate(loan.dueDate)}
                              {loan.returnDate && (
                                <>
                                  <br/>
                                  <span className="font-normal text-muted-foreground">Devuelto:</span> {formatDate(loan.returnDate)}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Multa: ${loan.fine?.toLocaleString() ?? "0"}</p>
                          </div>
                        </div>
                      </div>
                      {/* Si tienes comentarios los puedes mostrar aquí */}
                      {loan.comments && (
                        <p className="text-sm text-muted-foreground mt-3 bg-gray-50 p-2 rounded">
                          {loan.comments}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {loan.status?.toUpperCase() === "ACTIVE" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleReturnLoan(loan.id)}>
                            Devolver
                          </Button>
                          <Button variant="outline" size="sm">
                            Extender
                          </Button>
                        </>
                      )}
                      {loan.status?.toUpperCase() === "EXPIRED" && (
                        <>
                          <Button variant="destructive" size="sm">
                            Contactar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReturnLoan(loan.id)}>
                            Devolver
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Préstamos activos */}
        <TabsContent value="Activo">
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{loan.toolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {loan.customerName} - Vence: {formatDate(loan.dueDate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleReturnLoan(loan.id)}>
                        Devolver
                      </Button>
                      <Button variant="outline" size="sm">Extender</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Préstamos vencidos */}
        <TabsContent value="Vencido">
          <div className="space-y-4">
            {overdueLoans.map((loan) => (
              <Card key={loan.id} className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1 text-red-800">{loan.toolName}</h3>
                      <p className="text-sm text-red-600">
                        {loan.customerName} - Vencido desde: {formatDate(loan.dueDate)}
                      </p>
                      {loan.fine > 0 && (
                        <p className="text-sm text-red-600 font-medium">
                          Multa acumulada: ${loan.fine.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">Contactar</Button>
                      <Button variant="outline" size="sm" onClick={() => handleReturnLoan(loan.id)}>
                        Devolver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Préstamos devueltos */}
        <TabsContent value="Devuelto">
          <div className="space-y-4">
            {returnedLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{loan.toolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {loan.customerName} - Devuelto: {formatDate(loan.returnDate)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}