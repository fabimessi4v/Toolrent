import { useState } from "react";
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
  MapPin,
  Calendar,
  Edit3,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";

export function ClientsManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    {
      id: "C001",
      name: "Juan Pérez",
      rut: "12.345.678-9",
      email: "juan.perez@email.com",
      phone: "+56 9 1234 5678",
      address: "Av. Libertador 1234, Santiago",
      registrationDate: "2025-01-15",
      totalLoans: 8,
      activeLoans: 1,
      overdueLoans: 0,
      status: "Activo",
      unpaidFines: 0,
      replacementDebts: 0,
      lastLoanDate: "2025-08-26",
      notes: "Cliente preferencial"
    },
    {
      id: "C002",
      name: "María González",
      rut: "11.222.333-4", 
      email: "maria.gonzalez@email.com",
      phone: "+56 9 8765 4321",
      address: "Los Robles 567, Las Condes",
      registrationDate: "2025-02-20",
      totalLoans: 5,
      activeLoans: 1,
      overdueLoans: 0,
      status: "Activo",
      unpaidFines: 0,
      replacementDebts: 0,
      lastLoanDate: "2025-08-25",
      notes: ""
    },
    {
      id: "C003",
      name: "Carlos Ruiz",
      rut: "13.444.555-6",
      email: "carlos.ruiz@email.com",
      phone: "+56 9 5555 1234",
      address: "Santa Rosa 890, Ñuñoa",
      registrationDate: "2025-03-10",
      totalLoans: 12,
      activeLoans: 0,
      overdueLoans: 1,
      status: "Restringido",
      unpaidFines: 75,
      replacementDebts: 0,
      lastLoanDate: "2025-08-24",
      notes: "Préstamo vencido desde 2025-08-28"
    },
    {
      id: "C004",
      name: "Ana López",
      rut: "14.666.777-8",
      email: "ana.lopez@email.com",
      phone: "+56 9 9999 8888",
      address: "Pedro de Valdivia 345, Providencia",
      registrationDate: "2025-01-05",
      totalLoans: 15,
      activeLoans: 0,
      overdueLoans: 0,
      status: "Activo",
      unpaidFines: 0,
      replacementDebts: 0,
      lastLoanDate: "2025-08-24",
      notes: "Cliente excelente, siempre devuelve a tiempo"
    },
    {
      id: "C005",
      name: "Pedro Sánchez",
      rut: "15.888.999-0",
      email: "pedro.sanchez@email.com",
      phone: "+56 9 7777 6666",
      address: "Maipú 445, Centro",
      registrationDate: "2024-12-01",
      totalLoans: 3,
      activeLoans: 0,
      overdueLoans: 0,
      status: "Restringido",
      unpaidFines: 0,
      replacementDebts: 120000,
      lastLoanDate: "2025-08-15",
      notes: "Debe valor de reposición de Martillo Demoledor"
    }
  ];

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
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.rut.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la información de tus clientes
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-name">Nombre completo *</Label>
                <Input id="client-name" placeholder="Juan Pérez" required />
              </div>
              <div>
                <Label htmlFor="client-rut">RUT *</Label>
                <Input id="client-rut" placeholder="12.345.678-9" required />
              </div>
              <div>
                <Label htmlFor="client-phone">Teléfono *</Label>
                <Input id="client-phone" placeholder="+56 9 1234 5678" required />
              </div>
              <div>
                <Label htmlFor="client-email">Email *</Label>
                <Input id="client-email" type="email" placeholder="juan@email.com" required />
              </div>
              <div>
                <Label htmlFor="client-address">Dirección</Label>
                <Input id="client-address" placeholder="Av. Libertador 1234" />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Estado inicial:</strong> Activo (puede solicitar préstamos)
                </p>
              </div>
              <Button className="w-full">Agregar Cliente</Button>
            </div>
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
                  {clients.reduce((sum, c) => sum + c.activeLoans, 0)}
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
                    Cliente desde {new Date(client.registrationDate).toLocaleDateString('es-CL')}
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
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Arriendos totales</p>
                    <p className="font-semibold">{client.totalLoans}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arriendos activos</p>
                    <p className="font-semibold">{client.activeLoans}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Multas impagas</p>
                    <p className={`font-semibold ${
                      client.unpaidFines > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${client.unpaidFines.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reposiciones</p>
                    <p className={`font-semibold ${
                      client.replacementDebts > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${client.replacementDebts.toLocaleString()}
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

      {filteredClients.length === 0 && (
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
