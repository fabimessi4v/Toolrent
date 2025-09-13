import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  DollarSign, 
  Save, 
  Settings,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { createFee, getFee } from "../services/feeService"; // <- asegúrate que getFee exista

export function RatesConfiguration({ onNavigate }) {
  const [globalRates, setGlobalRates] = useState({
    dailyFineRate: 30,
    lastUpdated: "2025-08-15",
    updatedBy: "admin"
  });

  // Cargar la tarifa global vigente al montar el componente
  useEffect(() => {
    // getFee puede no existir, revisa el import si da error
    getFee('LATE_FEE')
      .then(response => {
        const fee = response.data;
        setGlobalRates(prev => ({
          ...prev,
          dailyFineRate: fee.value,
          lastUpdated: fee.lastUpdated ?? "",
          updatedBy: fee.updatedBy ?? ""
        }));
      })
      .catch(err => {
        // Manejo de error: puedes mostrar un mensaje o dejar el valor en 0
        setGlobalRates(prev => ({
          ...prev,
          dailyFineRate: 0
        }));
      });
  }, []);

  // Estados para feedback
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [globalSuccessMsg, setGlobalSuccessMsg] = useState("");
  const [globalErrorMsg, setGlobalErrorMsg] = useState("");

  // (Si más adelante vuelves a usar estas tarifas específicas)
  const [toolSpecificRates, setToolSpecificRates] = useState([
    { id: "T001", name: "Taladro Percutor Bosch GSB 120", category: "Taladros", dailyRentalRate: 450, dailyFineRate: 45, replacementValue: 85000, lastUpdated: "2025-08-20", updatedBy: "admin" },
    { id: "T002", name: "Sierra Circular Makita 5007MG", category: "Sierras", dailyRentalRate: 380, dailyFineRate: 38, replacementValue: 65000, lastUpdated: "2025-08-18", updatedBy: "admin" },
    { id: "T003", name: "Soldadora Lincoln Electric", category: "Soldadoras", dailyRentalRate: 750, dailyFineRate: 75, replacementValue: 150000, lastUpdated: "2025-08-15", updatedBy: "admin" },
    { id: "T004", name: "Amoladora DeWalt DWE402", category: "Amoladoras", dailyRentalRate: 280, dailyFineRate: 28, replacementValue: 45000, lastUpdated: "2025-08-22", updatedBy: "admin" }
  ]);

  const handleUpdateGlobalRates = async () => {
    setSavingGlobal(true);
    setGlobalSuccessMsg("");
    setGlobalErrorMsg("");
    try {
      await createFee({
        type: "LATE_FEE",
        value: Number(globalRates.dailyFineRate),
      });

      const today = new Date().toISOString().split("T")[0];
      setGlobalRates(prev => ({
        ...prev,
        lastUpdated: today,
        updatedBy: "admin",
      }));

      toast("Tarifa global (late fee) actualizada correctamente");
      setGlobalSuccessMsg("La tarifa se guardó correctamente.");
      // Limpiar el mensaje después de 4 segundos (opcional)
      setTimeout(() => setGlobalSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error al guardar tarifa late fee:", err);
      toast("Hubo un problema al actualizar la tarifa");
      setGlobalErrorMsg("No se pudo guardar la tarifa. Intenta nuevamente.");
      setTimeout(() => setGlobalErrorMsg(""), 5000);
    } finally {
      setSavingGlobal(false);
    }
  };

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

      {/* Global Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Tarifa Global (Late Fee)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="global-fine">Tarifa diaria de multa (Late Fee) ($)</Label>
              <Input 
                id="global-fine"
                type="number"
                value={globalRates.dailyFineRate}
                disabled={savingGlobal}
                onChange={(e) => setGlobalRates(prev => ({ ...prev, dailyFineRate: Number(e.target.value) }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Generalmente 10% de la tarifa de arriendo
              </p>
              {/* Tarifa vigente destacada */}
              <div className="mt-3">
                <span className="font-semibold text-blue-700">Tarifa vigente:</span>
                <span className="ml-2 text-blue-900 bg-green-100 px-2 py-1 rounded">
                  ${globalRates.dailyFineRate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Última actualización: {globalRates.lastUpdated} por {globalRates.updatedBy}
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
              {/* Mensajes inline */}
              {globalSuccessMsg && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {globalSuccessMsg}
                </div>
              )}
              {globalErrorMsg && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  {globalErrorMsg}
                </div>
              )}
              <Button 
                onClick={handleUpdateGlobalRates} 
                className="gap-2"
                disabled={savingGlobal}
              >
                <Save className="h-4 w-4" />
                {savingGlobal ? "Guardando..." : "Guardar Tarifa"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}