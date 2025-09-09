import { useEffect, useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
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
import { createLoan } from "../services/loansService.js";
import { getTools } from "../services/toolService.js";
import { getAllCustomers  } from "../services/customerService.js"; // Debes tener este servicio
import keycloak from "../keycloak";

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
      setTools(response.data); // [{id, name,...}]
    });
    getAllCustomers()
    .then(response => {
      console.log("Clientes:", response.data);
      setClients(response.data);
    })
    .catch(error => {
      console.error("Error clientes:", error); // <-- Este catch te mostrará si hay error
    });
  }, []);

  // Helpers (puedes completarlos con tu lógica)
  const getStatusBadge = (status) => <Badge>{status}</Badge>;
  const getStatusIcon = (status) => <CheckCircle2 />;

  const filteredLoans = loans.filter(loan => 
    loan.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Maneja cambios en el formulario
  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

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
        dueDate: form.endDate,
        notes: form.notes
      };
      const response = await createLoan(payload);
      alert("Préstamo creado con éxito");
      setLoans(prev => [...prev, response.data]);
      setDialogOpen(false);
      setForm({ clientId: "", toolId: "", startDate: "", endDate: "", notes: "" });
    } catch (e) {
      alert("Error al crear préstamo: " + (e.response?.data || e.message));
    } finally {
      setCreating(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Préstamos</h1>
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
      {/* Aquí puedes agregar stats, tabs y lista de préstamos */}
      {/* ... */}
    </div>
  );
}