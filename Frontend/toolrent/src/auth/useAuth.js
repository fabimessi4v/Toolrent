import { useKeycloak } from "@react-keycloak/web";
import { useMockKeycloak } from "./MockAuthProvider";

/**
 * Hook dinámico de autenticación
 * Usa Keycloak real en producción o auth mock en desarrollo
 * 
 * @returns {Object} { keycloak, initialized }
 */
export const useAuth = () => {
    const USE_KEYCLOAK = import.meta.env.VITE_USE_KEYCLOAK === 'true';

    if (USE_KEYCLOAK) {
        return useKeycloak(); // Hook real de Keycloak
    } else {
        return useMockKeycloak(); // Hook mock para desarrollo
    }
};
