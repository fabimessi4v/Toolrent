import { useKeycloak } from "@react-keycloak/web";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ToolsManagement } from "./components/ToolsManagement";
import { LoansManagement } from "./components/RentalsManagement";
import { ClientsManagement } from "./components/ClientsManagement";
import { KardexManagement } from "./components/KardexManagement";
import { RatesConfiguration } from "./components/RatesConfiguration";
import CustomerList from "./components/CustomerList";
import { ReportsManagement } from "./components/ReportsManagement";
export default function App() {
  const { keycloak, initialized } = useKeycloak();

  // Debug Keycloak state
  console.log("Keycloak instance:", keycloak);
  console.log("Initialized:", initialized);
  console.log("Authenticated:", keycloak?.authenticated);

  const [currentSection, setCurrentSection] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);

if (!initialized) {
  return <div>Cargando Keycloak...</div>; // Espera hasta que termine de inicializar
}

  if (!keycloak.authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="mb-4">No autenticado</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => keycloak.login()}
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  const handleNavigate = (section) => setCurrentSection(section);
  const handleLogout = () => keycloak.logout();

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard": return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case "tools": return <ToolsManagement onNavigate={handleNavigate} />;
      case "loans": return <LoansManagement onNavigate={handleNavigate} />;
      case "clients": return <ClientsManagement onNavigate={handleNavigate} />;
      case "kardex": return <KardexManagement onNavigate={handleNavigate} />;
      case "rates": return <RatesConfiguration onNavigate={handleNavigate} />;
      case "customers": return <CustomerList />;
      case "reports": return <ReportsManagement onNavigate={handleNavigate} />;
      default: return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && (
        <Sidebar
          currentSection={currentSection}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      <main className={`p-6 lg:p-8 pt-16 lg:pt-8 ${showSidebar ? "flex-1" : "w-full"}`}>
        <h1>
          Bienvenido a Toolrent: {keycloak.tokenParsed?.preferred_username}
        </h1>
        {renderContent()}
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  );
}
