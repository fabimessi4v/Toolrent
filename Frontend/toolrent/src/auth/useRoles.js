import { useKeycloak } from "@react-keycloak/web";
import { useMockKeycloak } from "./MockAuthProvider";

/**
 * Hook para obtener y verificar los realm roles del usuario autenticado.
 * 
 * Los roles se leen desde tokenParsed.realm_access.roles (realm roles de KC).
 * 
 * Roles soportados:
 *  - ADMIN    → acceso completo a la app
 *  - EMPLEADO → solo: loans, kardex, reports
 */
export const useRoles = () => {
    const USE_KEYCLOAK = import.meta.env.VITE_USE_KEYCLOAK === "true";
    const { keycloak } = USE_KEYCLOAK ? useKeycloak() : useMockKeycloak();

    const realmRoles = keycloak?.tokenParsed?.realm_access?.roles || [];

    const isAdmin = realmRoles.includes("ADMIN");
    const isEmpleado = realmRoles.includes("EMPLEADO");

    /**
     * Devuelve true si el usuario tiene acceso a la sección dada.
     * @param {string} section - ID de sección (ej: "tools", "loans", "dashboard")
     */
    const canAccess = (section) => {
        if (isAdmin) return true;
        if (isEmpleado) return ["loans", "kardex", "reports"].includes(section);
        return false;
    };

    return { realmRoles, isAdmin, isEmpleado, canAccess };
};
