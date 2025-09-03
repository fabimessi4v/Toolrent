import axios from 'axios';

// Asegúrate de que tu API de Spring Boot corre en el puerto 8081
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función que usará tu lista para obtener los datos
export const getTools = () => {
  return apiClient.get('/tools');
};

// Función que usará el formulario para crear nuevas herramientas
export const createCustomer = (toolsData) => {
  return apiClient.post('/tools', toolsData);
};