import React, { useState, useEffect } from 'react';
import { getAllCustomers } from '../services/customerService';

// 1. Importamos los componentes de la tabla desde la carpeta 'ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CustomerList = ({ refreshKey }) => {
  // 2. Estados para guardar los clientes, y manejar la carga y errores
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 3. Esta función se conecta al endpoint para recibir los datos
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await getAllCustomers(); // Llama a nuestro servicio
        setCustomers(response.data); // Guarda los datos en el estado
        setError(null);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setError('No se pudieron cargar los clientes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshKey]); // Se ejecuta al cargar y cuando `refreshKey` cambia

  if (loading) {
    return <p>Cargando clientes...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // 4. Desplegamos los datos en la tabla de Shadcn UI
  return (
    <div>
      <h3>Lista de Clientes</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RUT</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.rut}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                No hay clientes registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerList;