import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  DollarSign, 
  Save, 
  AlertTriangle,
  Settings,
  Edit3,
  CheckCircle
} from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function RatesConfiguration({ onNavigate }) {
  const [globalRates, setGlobalRates] = useState({
    dailyRentalRate: 300,
    dailyFineRate: 30,
    lastUpdated: "2025-08-15",
    updatedBy: "admin"
  });

  const [toolSpecificRates, setToolSpecificRates] = useState([
    { id: "T001", name: "Taladro Percutor Bosch GSB 120", category: "Taladros", dailyRentalRate: 450, dailyFineRate: 45, replacementValue: 85000, lastUpdated: "2025-08-20", updatedBy: "admin" },
    { id: "T002", name: "Sierra Circular Makita 5007MG", category: "Sierras", dailyRentalRate: 380, dailyFineRate: 38, replacementValue: 65000, lastUpdated: "2025-08-18", updatedBy: "admin" },
    { id: "T003", name: "Soldadora Lincoln Electric", category: "Soldadoras", dailyRentalRate: 750, dailyFineRate: 75, replacementValue: 150000, lastUpdated: "2025-08-15", updatedBy: "admin" },
    { id: "T004", name: "Amoladora DeWalt DWE402", category: "Amoladoras", dailyRentalRate: 280, dailyFineRate: 28, replacementValue: 45000, lastUpdated: "2025-08-22", updatedBy: "admin" }
  ]);

  const [editingTool, setEditingTool] = useState(null);
  const [tempRates, setTempRates] = useState({
    dailyRentalRate: 0,
    dailyFineRate: 0,
    replacementValue: 0
  });

  const handleEditTool = (tool) => {
    setEditingTool(tool.id);
    setTempRates({
      dailyRentalRate: tool.dailyRentalRate,
      dailyFineRate: tool.dailyFineRate,
      replacementValue: tool.replacementValue
    });
  };

  const handleSaveToolRates = () => {
    setToolSpecificRates(prev => prev.map(tool => 
      tool.id === editingTool 
        ? { ...tool, ...tempRates, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: "admin" }
        : tool
    ));
    setEditingTool(null);
    toast("Tarifas actualizadas correctamente");
  };

  const handleUpdateGlobalRates = () => {
    setGlobalRates(prev => ({ ...prev, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: "admin" }));
    toast("Tarifas globales actualizadas correctamente");
  };

  const categoryStats = toolSpecificRates.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = { count: 0, avgRentalRate: 0, totalValue: 0 };
    acc[tool.category].count++;
    acc[tool.category].avgRentalRate += tool.dailyRentalRate;
    acc[tool.category].totalValue += tool.replacementValue;
    return acc;
  }, {});

  Object.keys(categoryStats).forEach(category => {
    categoryStats[category].avgRentalRate = Math.round(categoryStats[category].avgRentalRate / categoryStats[category].count);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Configuración de Tarifas</h1>
          <p className="text-muted-foreground">
            Administra tarifas de arriendo, multas y valores de reposición
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Solo Administradores
        </Badge>
      </div>

      {/* Warning Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-1">Importante - Cambios de Tarifas</h3>
              <p className="text-sm text-orange-700">
                Los cambios en las tarifas solo afectan a los nuevos préstamos. Los préstamos activos mantienen las tarifas vigentes al momento de su creación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Tarifas Globales por Defecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="global-rental">Tarifa diaria de arriendo por defecto ($)</Label>
              <Input 
                id="global-rental"
                type="number"
                value={globalRates.dailyRentalRate}
                onChange={(e) => setGlobalRates(prev => ({ ...prev, dailyRentalRate: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">Se aplica a herramientas sin tarifa específica</p>
            </div>
            <div>
              <Label htmlFor="global-fine">Tarifa diaria de multa por defecto ($)</Label>
              <Input 
                id="global-fine"
                type="number"
                value={globalRates.dailyFineRate}
                onChange={(e) => setGlobalRates(prev => ({ ...prev, dailyFineRate: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">Generalmente 10% de la tarifa de arriendo</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Última actualización: {globalRates.lastUpdated} por {globalRates.updatedBy}
            </p>
            <Button onClick={handleUpdateGlobalRates} className="gap-2">
              <Save className="h-4 w-4" /> Guardar Tarifas Globales
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <Card>
        <CardHeader><CardTitle>Resumen por Categoría</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{category}</h4>
                <div className="space-y-1 text-sm">
                  <p>Herramientas: {stats.count}</p>
                  <p>Tarifa promedio: ${stats.avgRentalRate.toLocaleString()}/día</p>
                  <p>Valor total: ${stats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Specific Rates */}
      <Card>
        <CardHeader><CardTitle>Tarifas Específicas por Herramienta</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toolSpecificRates.map((tool) => (
              <div key={tool.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{tool.name}</h3>
                      <Badge variant="outline">{tool.category}</Badge>
                    </div>

                    {editingTool === tool.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Tarifa arriendo/día ($)</Label>
                          <Input type="number" value={tempRates.dailyRentalRate} onChange={e => setTempRates(prev => ({ ...prev, dailyRentalRate: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <Label>Tarifa multa/día ($)</Label>
                          <Input type="number" value={tempRates.dailyFineRate} onChange={e => setTempRates(prev => ({ ...prev, dailyFineRate: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <Label>Valor reposición ($)</Label>
                          <Input type="number" value={tempRates.replacementValue} onChange={e => setTempRates(prev => ({ ...prev, replacementValue: Number(e.target.value) }))} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div><p className="text-sm text-muted-foreground">Tarifa arriendo</p><p className="font-semibold">${tool.dailyRentalRate.toLocaleString()}/día</p></div>
                        <div><p className="text-sm text-muted-foreground">Tarifa multa</p><p className="font-semibold">${tool.dailyFineRate.toLocaleString()}/día</p></div>
                        <div><p className="text-sm text-muted-foreground">Valor reposición</p><p className="font-semibold">${tool.replacementValue.toLocaleString()}</p></div>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground">Última actualización: {tool.lastUpdated} por {tool.updatedBy}</p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {editingTool === tool.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveToolRates} className="gap-2"><CheckCircle className="h-4 w-4" /> Guardar</Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingTool(null)}>Cancelar</Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEditTool(tool)} className="gap-2"><Edit3 className="h-4 w-4" /> Editar</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Update */}
      <Card>
        <CardHeader><CardTitle>Actualización Masiva</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Funciones de actualización masiva</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">Aumentar todas las tarifas en %</Button>
              <Button variant="outline" className="justify-start">Aplicar tarifa por categoría</Button>
              <Button variant="outline" className="justify-start">Calcular multas automáticamente (10%)</Button>
              <Button variant="outline" className="justify-start">Importar tarifas desde Excel</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
