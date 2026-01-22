import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "./App";
import keycloak from "./services/keycloak"; // tu instancia Keycloak

const eventLogger = (event, error) => {
  console.log("Keycloak event:", event, error);
};

const tokenLogger = (tokens) => {
  console.log("Tokens updated:", tokens);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "login-required",   // fuerza login si no hay sesión
      pkceMethod: "S256",
      checkLoginIframe: false,
    }}
    onEvent={eventLogger}         // opcional, para debug
    onTokens={tokenLogger}        // opcional, para debug
  >
    <App />
  </ReactKeycloakProvider>
);


