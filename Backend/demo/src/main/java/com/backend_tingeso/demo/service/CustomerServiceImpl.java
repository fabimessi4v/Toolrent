package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
    public Customer createCustomer(Customer customer) {
        // Podrías agregar validaciones aquí, ej: verificar formato del RUT.
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

}
