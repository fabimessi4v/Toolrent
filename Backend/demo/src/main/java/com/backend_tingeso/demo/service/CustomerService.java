package com.backend_tingeso.demo.service;
import com.backend_tingeso.demo.entity.Customer;

import java.util.List;

/**
 * Se define que se puede hacer, pero no como
 *
 *
 */
public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer createCustomer(Customer customer);
}
