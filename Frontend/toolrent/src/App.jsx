import { useKeycloak } from "@react-keycloak/web";
import { useMockKeycloak } from "./auth/MockAuthProvider";
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
import { ClarityNavigationTracker } from "./components/ClarityNavigationTracker";
import { AccessDenied } from "./components/AccessDenied";
import { useRoles } from "./auth/useRoles";

// Hook dinámico: usa el real o el mock según el modo
const useAuth = () => {
  const USE_KEYCLOAK = import.meta.env.VITE_USE_KEYCLOAK === 'true';

  if (USE_KEYCLOAK) {
    return useKeycloak(); // Hook real de Keycloak
  } else {
    return useMockKeycloak(); // Hook mock para desarrollo
  }
};

export default function App() {
  const { keycloak, initialized } = useAuth();
  const { canAccess } = useRoles();

  // Debug auth state
  console.log("Auth instance:", keycloak);
  console.log("Initialized:", initialized);
  console.log("Authenticated:", keycloak?.authenticated);

  const [currentSection, setCurrentSection] = useState("dashboard");
  const [showSidebar] = useState(true);

  if (!initialized) {
    return <div>Cargando autenticación...</div>;
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

  // Wrapper que protege cada sección según el realm role del usuario
  const Protected = ({ section, children }) =>
    canAccess(section) ? children : <AccessDenied section={section} />;

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <Protected section="dashboard"><Dashboard onNavigate={handleNavigate} onLogout={handleLogout} /></Protected>;
      case "tools":
        return <Protected section="tools"><ToolsManagement onNavigate={handleNavigate} /></Protected>;
      case "loans":
        return <Protected section="loans"><LoansManagement onNavigate={handleNavigate} /></Protected>;
      case "clients":
        return <Protected section="clients"><ClientsManagement onNavigate={handleNavigate} /></Protected>;
      case "kardex":
        return <Protected section="kardex"><KardexManagement onNavigate={handleNavigate} /></Protected>;
      case "rates":
        return <Protected section="rates"><RatesConfiguration onNavigate={handleNavigate} /></Protected>;
      case "customers":
        return <Protected section="customers"><CustomerList /></Protected>;
      case "reports":
        return <Protected section="reports"><ReportsManagement onNavigate={handleNavigate} /></Protected>;
      default:
        return <Protected section="dashboard"><Dashboard onNavigate={handleNavigate} onLogout={handleLogout} /></Protected>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Tracker invisible de Clarity para detectar cambios de navegación */}
      <ClarityNavigationTracker currentSection={currentSection} />

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
