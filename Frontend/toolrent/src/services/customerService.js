import axios from 'axios';

// Asegúrate de que tu API de Spring Boot corre en el puerto 8080
const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función que usará tu lista para obtener los datos
export const getAllCustomers = () => {
  return apiClient.get('/customers');
};

// Función que usará el formulario para crear nuevos clientes
export const createCustomer = (customerData) => {
  return apiClient.post('/customers', customerData);
};