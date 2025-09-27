import axios from 'axios';
import keycloak from '../keycloak'; // asegúrate de la ruta correcta

// Configuración del cliente Axios
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

// Función que usará tu lista para obtener los datos
export const getTools = () => {
  return apiClient.get('/tools');
};

// Función que usará el formulario para crear nuevas herramientas
export const createTool = (toolsData) => {
  return apiClient.post('/tools', toolsData);
};

// Función para eliminar una herramienta por ID
export const deleteTool = (id) => {
  return apiClient.delete(`/tools/${id}`);
};
// Función para obtener el ranking de herramientas
export const getToolsRanking = () => {
  return apiClient.get('/tools/ranking');
};