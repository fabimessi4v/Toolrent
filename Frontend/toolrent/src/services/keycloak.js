// src/keycloak.js
import Keycloak from 'keycloak-js';

// Configuración de Keycloak
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,       // URL de tu servidor Keycloak
  realm: import.meta.env.VITE_KEYCLOAK_REALM,                   // Nombre de tu realm
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,       // ID de tu cliente
};

// Crea una instancia de Keycloak
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;