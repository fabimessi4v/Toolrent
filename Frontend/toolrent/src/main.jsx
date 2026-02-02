import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "./App";
import keycloak from "./services/keycloak"; // tu instancia Keycloak
import { MockAuthProvider } from "./auth/MockAuthProvider";
import { ToastProvider } from "./components/ToastProvider";

// Variable de entorno para activar/desactivar Keycloak
const USE_KEYCLOAK = import.meta.env.VITE_USE_KEYCLOAK === 'true';

const eventLogger = (event, error) => {
  console.log("Keycloak event:", event, error);
};

const tokenLogger = (tokens) => {
  console.log("Tokens updated:", tokens);
};

// Componente condicional: con o sin Keycloak
const AppWrapper = () => {
  if (USE_KEYCLOAK) {
    // MODO PRODUCCIÓN: Con autenticación Keycloak
    console.log("🔐 Running with Keycloak authentication");
    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
          onLoad: "login-required",   // fuerza login si no hay sesión
          pkceMethod: "S256",         // obligatorio para clientes públicos
          checkLoginIframe: false,    // evita errores de iframe
        }}
        onEvent={eventLogger}         // opcional, para debug
        onTokens={tokenLogger}        // opcional, para debug
      >
        <ToastProvider>
          <App />
        </ToastProvider>
      </ReactKeycloakProvider>
    );
  } else {
    // MODO DESARROLLO: Con autenticación simulada (mock)
    console.log("🚧 Running in DEV mode (Mock Auth)");
    return (
      <MockAuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </MockAuthProvider>
    );
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);


