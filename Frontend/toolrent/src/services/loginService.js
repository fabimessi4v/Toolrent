import axios from 'axios';

// Cliente Axios para tu API de Spring Boot
const apiClient = axios.create({
  baseURL: 'https://toolrent.duckdns.org/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para iniciar sesión
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/login', { username, password });

    // Guardar token JWT en localStorage
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
    }

    return response.data; // Devuelve { token: "..." }
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('jwtToken');
};

const handleLogout = () => {
  keycloak.logout();
  localStorage.removeItem("jwtToken");
  setAuthenticated(false);
};

if (!authenticated) {
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
