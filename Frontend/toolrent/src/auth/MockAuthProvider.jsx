import React, { createContext, useContext, useState } from 'react';

// Contexto para simular useKeycloak en modo desarrollo
const MockAuthContext = createContext(null);

/**
 * Provider que simula ReactKeycloakProvider para desarrollo
 * Proporciona un objeto keycloak falso con la misma API
 */
export const MockAuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(true);

    // Mock del objeto keycloak con datos de usuario de prueba
    const mockKeycloak = {
        authenticated,
        login: () => {
            console.log('🔓 Mock login called');
            setAuthenticated(true);
        },
        logout: () => {
            console.log('🔒 Mock logout called');
            setAuthenticated(false);
        },
        tokenParsed: {
            preferred_username: 'dev_user',
            email: 'dev@toolrent.com',
            name: 'Developer User',
            // ─── Realm roles (cambiar a ["EMPLEADO"] para testear acceso restringido) ───
            realm_access: {
                roles: ['ADMIN'],
            },
            // ─── Client roles (mantener para compatibilidad con ToolsManagement) ───
            resource_access: {
                'toolrent-frontend': {
                    roles: ['ADMIN'],
                },
            },
        },
        token: 'mock_jwt_token_for_development',
        refreshToken: 'mock_refresh_token',
        updateToken: (minValidity) => {
            console.log('🔄 Mock token refresh called');
            return Promise.resolve(true);
        },
    };

    const contextValue = {
        keycloak: mockKeycloak,
        initialized: true, // Siempre inicializado en modo dev
    };

    return (
        <MockAuthContext.Provider value={contextValue}>
            {children}
        </MockAuthContext.Provider>
    );
};

/**
 * Hook para usar en componentes
 * Compatible con useKeycloak de @react-keycloak/web
 */
export const useMockKeycloak = () => {
    const context = useContext(MockAuthContext);
    if (!context) {
        throw new Error('useMockKeycloak must be used within MockAuthProvider');
    }
    return context;
};
