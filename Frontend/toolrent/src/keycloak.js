// src/keycloak.js
import Keycloak from 'keycloak-js';

// Configuración de Keycloak
const keycloakConfig = {
  url: 'https://toolrent.duckdns.org/keycloak',       // URL de tu servidor Keycloak
  realm: 'toolrent',                   // Nombre de tu realm
  clientId: 'toolrent-frontend',       // ID de tu cliente
};

// Crea una instancia de Keycloak
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;