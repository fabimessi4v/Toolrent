import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Plus, 
  User,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";

// IMPORTA EL SERVICIO CORRECTO
import { getAllCustomersDTO, createCustomer } from "../services/customerService.js";

export function ClientsManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para crear cliente
  const [newClient, setNewClient] = useState({
    name: "",
    rut: "",
    phone: "",
    email: "",
    status: "Activo"
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Logs para saber qué pasa en la petición de clientes
  useEffect(() => {
    console.log("Obteniendo clientes DTO...");
    getAllCustomersDTO()
      .then(response => {
        console.log("Clientes recibidos (DTO):", response.data);
        setClients(response.data); // Asume que response.data es un array DTO
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener clientes:", error);
        setLoading(false);
      });
  }, []);

  // Maneja el cambio en los inputs del formulario
  const handleInputChange = (e) => {
    setNewClient({
      ...newClient,
      [e.target.name]: e.target.value
    });
  };

  // Maneja el submit del formulario para crear cliente
  const handleCreateClient = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    console.log("Creando cliente:", newClient);
    try {
      const createResponse = await createCustomer(newClient);
      console.log("Respuesta al crear cliente:", createResponse);
      // Actualiza la lista de clientes usando el DTO
      const response = await getAllCustomersDTO();
      console.log("Clientes actualizados tras crear:", response.data);
      setClients(response.data);
      setNewClient({
        name: "",
        rut: "",
        phone: "",
        email: "",
        status: "Activo"
      });
      setDialogOpen(false);
    } catch (err) {
      setError("Error al crear el cliente");
      console.error("Error al crear cliente:", err);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case "Restringido":
        return <Badge variant="destructive">Restringido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.rut?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 class="font-sans text-3xl">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la información de tus clientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateClient}>
              <div>
                <Label htmlFor="client-name">Nombre completo *</Label>
                <Input
                  id="client-name"
                  name="name"
                  placeholder="Juan Pérez"
                  required
                  value={newClient.name}
                  onChange={handleInputChange}
                  disabled={creating}
                />
              </div>
              <div>
                <Label htmlFor="client-rut">RUT *</Label>
                <Input
                  id="client-rut"
                  name="rut"
                  placeholder="12.345.678-9"
                  required
                  value={newClient.rut}
                  onChange={handleInputChange}
                  disabled={creating}
                />
              </div>
              <div>
                <Label htmlFor="client-phone">Teléfono *</Label>
                <Input
                  id="client-phone"
                  name="phone"
                  placeholder="+56 9 1234 5678"
                  required
                  value={newClient.phone}
                  onChange={handleInputChange}
                  disabled={creating}
                />
              </div>
              <div>
                <Label htmlFor="client-email">Email *</Label>
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  required
                  value={newClient.email}
                  onChange={handleInputChange}
                  disabled={creating}
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Estado inicial:</strong> Activo (puede solicitar préstamos)
                </p>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button className="w-full" type="submit" disabled={creating}>
                {creating ? "Agregando..." : "Agregar Cliente"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-semibold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Activos</p>
                <p className="text-2xl font-semibold">
                  {clients.filter(c => c.status === 'Activo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Restringidos</p>
                <p className="text-2xl font-semibold">
                  {clients.filter(c => c.status === 'Restringido').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arriendos Activos</p>
                <p className="text-2xl font-semibold">
                  {/* sumamos los activeLoans de cada cliente DTO */}
                  {clients.reduce((sum, c) => sum + (c.activeLoans || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Cargando clientes...</h3>
            <p className="text-muted-foreground mb-4">
              Por favor espera mientras se obtiene la información.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {client.name}
                      {getStatusBadge(client.status)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Cliente desde {client.registrationDate ? new Date(client.registrationDate).toLocaleDateString('es-CL') : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Arriendos totales</p>
                      <p className="font-semibold">{client.totalLoans ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Arriendos activos</p>
                      <p className="font-semibold">{client.activeLoans ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Multas impagas</p>
                      <p className={`font-semibold ${
                        (client.unpaidFines ?? 0) > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {/* Muestra 1 si tiene multa, 0 si no */}
                        {client.unpaidFines ?? "0"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Historial
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Nuevo Arriendo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No se encontraron clientes</h3>
            <p className="text-muted-foreground mb-4">
              No hay clientes que coincidan con tu búsqueda.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}