package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Esta clase contiene la lógica real. Implementa la interfaz y usa el CustomerRepository para interactuar con la base de datos.
 *
 *
 */
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;

    // Spring automáticamente nos "pasa" una instancia de CustomerRepository.
    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }


    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer createCustomer(Customer customer) {
        // Validaciones básicas
        if (customer == null) throw new IllegalArgumentException("El cliente no puede ser nulo.");
        if (customer.getName() == null || customer.getName().isBlank()) throw new IllegalArgumentException("El nombre es obligatorio.");
        if (customer.getRut() == null || customer.getRut().isBlank()) throw new IllegalArgumentException("El RUT es obligatorio.");
        if (customer.getEmail() == null || customer.getEmail().isBlank()) throw new IllegalArgumentException("El email es obligatorio.");
        if (customer.getPhone() == null || customer.getPhone().isBlank()) throw new IllegalArgumentException("El teléfono es obligatorio.");
        // Asignar ID si no viene en el request
        if (customer.getId() == null || customer.getId().isBlank()) {
            customer.setId(UUID.randomUUID().toString());
        }
        // Estado inicial y fecha de registro
        customer.setStatus("Activo");
        customer.setCreatedAt(java.time.LocalDateTime.now());

        // Si usas JPA/Hibernate, el método save retorna el objeto persistido con el ID generado
        return customerRepository.save(customer);
    }

}
