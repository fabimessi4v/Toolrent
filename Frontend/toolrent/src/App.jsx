import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ToolsManagement } from "./components/ToolsManagement";
import { LoansManagement } from "./components/RentalsManagement";
import { ClientsManagement } from "./components/ClientsManagement";
import { KardexManagement } from "./components/KardexManagement";
import { RatesConfiguration } from "./components/RatesConfiguration";
import CustomerList from "./components/CustomerList";
import Login from "./components/Login";
import { logout } from "./services/loginService";

export default function App() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setUser("Usuario"); // Opcional: decodificar token
    }
  }, []);

  const handleNavigate = (section) => setCurrentSection(section);

  const handleLogin = (username) => setUser(username);

  const handleLogout = () => {
    logout();
    setUser(null); // vuelve al login
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard": return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case "tools": return <ToolsManagement onNavigate={handleNavigate} />;
      case "loans": return <LoansManagement onNavigate={handleNavigate} />;
      case "clients": return <ClientsManagement onNavigate={handleNavigate} />;
      case "kardex": return <KardexManagement onNavigate={handleNavigate} />;
      case "rates": return <RatesConfiguration onNavigate={handleNavigate} />;
      case "customers": return <CustomerList />;
      default: return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  // Si no hay usuario, muestra solo el login
  if (!user) {
    return <Login onLogin={handleLogin} />; // <-- así está bien, no lo pongas dentro de un div flex
  }

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
        {renderContent()}
      </main>
    </div>
  );
}
