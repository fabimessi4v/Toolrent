import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

/**
 * Componente invisible que trackea cambios de navegación en Clarity
 * Úsalo dentro de tu App.jsx para notificar a Clarity cuando cambia la sección actual
 */
export function ClarityNavigationTracker({ currentSection }) {
    useEffect(() => {
        // Notifica a Clarity que hubo un cambio de "página" (vista)
        Clarity.event("page_view");

        // También puedes agregar un tag personalizado para filtrar en Clarity
        Clarity.setTag("current_section", currentSection);

    }, [currentSection]);

    return null; // Este componente no renderiza nada
}
