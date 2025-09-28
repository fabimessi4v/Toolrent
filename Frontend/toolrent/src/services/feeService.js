import axios from 'axios';
import keycloak from '../keycloak'; // asegúrate de la ruta correcta
// Asegúrate de que tu API de Spring Boot corre en el puerto 8080
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


// Mantengo el nombre createFee para no tocar tu UI.
// feeData debe traer: { type: 'LATE_FEE', value: 40 }
export const createFee = (feeData) => {
  return apiClient.put(`/fee/${feeData.type}`, { value: feeData.value });
};
// GET actual tarifa por tipo, por ejemplo: getFee('LATE_FEE')
export const getFee = (type) => {
  return apiClient.get(`/fee/${type}`);
};