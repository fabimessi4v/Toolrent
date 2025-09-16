package com.backend_tingeso.demo.service;
import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.dto.CustomerDTO;

import java.util.List;

/**
 * Se define que se puede hacer, pero no como
 *
 *
 */
public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer createCustomer(Customer customer);
    // Nuevo método para obtener clientes con sus datos calculados
    List<CustomerDTO> getAllCustomersWithCalculations();
    CustomerDTO getCustomerDTOById(String customerId);
}
