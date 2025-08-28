package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
// La URL base para todos los endpoints de clientes
@RequestMapping("/api/v1/customers")
public class CustomerController {

        private final CustomerService customerService;

        // Inyectamos la INTERFAZ, no la implementación.
        // El controlador no sabe que existe "CustomerServiceImpl", solo conoce el "contrato".
        public CustomerController(CustomerService customerService) {
            this.customerService = customerService;
        }

        @PostMapping
        public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
            Customer newCustomer = customerService.createCustomer(customer);
            return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
        }

        @GetMapping
        public List<Customer> getAllCustomers() {
            return customerService.getAllCustomers();
        }

    }
