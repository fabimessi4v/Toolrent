import axios from 'axios';
import keycloak from '../keycloak'; // asegúrate de la ruta correcta

// Ajusta el puerto/baseURL según tu backend
const apiClient = axios.create({
  baseURL: 'https://toolrent.duckdns.org/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});
// Interceptor para siempre usar token actualizado
apiClient.interceptors.request.use(
  async (config) => {
    if (keycloak?.token) {
      // Refresca el token si queda menos de 60 segundos
      await keycloak.updateToken(60);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Obtener todos los préstamos
export const getAllLoans = () => {
  return apiClient.get('/loans');
};

// Crear un nuevo préstamo
export const createLoan = (loanData) => {
  return apiClient.post('/loans', loanData);
};
// Devolver un préstamo
export const returnLoan = (loanId) => {
  return apiClient.put(`/loans/${loanId}/return`);
};