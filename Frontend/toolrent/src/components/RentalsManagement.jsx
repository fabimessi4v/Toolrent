import { useState } from "react";
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

export function LoansManagement({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loans = [
    { id: "P001", tool: "Taladro Bosch", client: "Juan Pérez", clientRut: "12.345.678-9", clientPhone: "+56 9 1234 5678", status: "Activo" },
    { id: "P002", tool: "Sierra Makita", client: "María González", clientRut: "11.222.333-4", clientPhone: "+56 9 8765 4321", status: "Activo" },
    { id: "P003", tool: "Soldadora Lincoln", client: "Carlos Ruiz", clientRut: "13.444.555-6", clientPhone: "+56 9 5555 1234", status: "Vencido" },
    { id: "P004", tool: "Amoladora DeWalt", client: "Ana López", clientRut: "14.666.777-8", clientPhone: "+56 9 9999 8888", status: "Devuelto" }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Activo": return <Badge className="bg-blue-100 text-blue-800">Activo</Badge>;
      case "Vencido": return <Badge variant="destructive">Vencido</Badge>;
      case "Devuelto": return <Badge className="bg-green-100 text-green-800">Devuelto</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Activo": return <Clock className="h-4 w-4 text-blue-600" />;
      case "Vencido": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "Devuelto": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredLoans = loans.filter(l => {
    const matchesSearch = l.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.clientRut.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeLoans = loans.filter(l => l.status === "Activo");
  const overdueLoans = loans.filter(l => l.status === "Vencido");
  const returnedLoans = loans.filter(l => l.status === "Devuelto");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Préstamos</h1>
          <p className="text-muted-foreground">Administra todos los préstamos de herramientas</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Préstamo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Nuevo Préstamo</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <Select><SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C001">Juan Pérez</SelectItem>
                    <SelectItem value="C002">María González</SelectItem>
                    <SelectItem value="C003">Carlos Ruiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Herramienta</Label>
                <Select><SelectTrigger><SelectValue placeholder="Seleccionar herramienta" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T001">Taladro Bosch</SelectItem>
                    <SelectItem value="T004">Amoladora DeWalt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Fecha inicio</Label><Input type="date" /></div>
                <div><Label>Fecha fin</Label><Input type="date" /></div>
              </div>
              <Button className="w-full">Crear Préstamo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="h-5 w-5 text-blue-600" /><p>Activos: {activeLoans.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-red-600" /><p>Vencidos: {overdueLoans.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-600" /><p>Devueltos: {returnedLoans.length}</p></CardContent></Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
          <TabsTrigger value="returned">Devueltos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card><CardContent className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por cliente, herramienta o RUT" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
                <SelectItem value="Devuelto">Devuelto</SelectItem>
              </SelectContent>
            </Select>
          </CardContent></Card>

          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">{getStatusIcon(loan.status)} {loan.tool} {getStatusBadge(loan.status)}</div>
                    <p className="text-sm"><User className="h-4 w-4" /> {loan.client} ({loan.clientRut})</p>
                    <p className="text-sm"><Calendar className="h-4 w-4" /> {loan.clientPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activos, Vencidos, Devueltos */}
        <TabsContent value="active">{activeLoans.map(l => <Card key={l.id}><CardContent className="flex justify-between items-center">{l.tool}</CardContent></Card>)}</TabsContent>
        <TabsContent value="overdue">{overdueLoans.map(l => <Card key={l.id}><CardContent className="flex justify-between items-center text-red-600">{l.tool}</CardContent></Card>)}</TabsContent>
        <TabsContent value="returned">{returnedLoans.map(l => <Card key={l.id}><CardContent className="flex justify-between items-center text-green-600">{l.tool}</CardContent></Card>)}</TabsContent>
      </Tabs>
    </div>
  );
}
