package com.backend_tingeso.demo.service;
import com.backend_tingeso.demo.entity.Customer;

import java.util.List;

/**
 * Se define que se puede hacer, pero no como
 *
 *
 */
public interface CustomerService {
    Customer createCustomer(Customer customer);
    List<Customer> getAllCustomers();
}
