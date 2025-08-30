import axios from 'axios';

// Cliente Axios para tu API de Spring Boot
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
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
