package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend_tingeso.demo.dto.CustomerDTO;

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



        @GetMapping
        public List<Customer> getAllCustomers() {
            return customerService.getAllCustomers();
        }
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        System.out.println("DEBUG: Recibiendo petición para crear cliente: " + customer);
        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            System.out.println("DEBUG: Cliente creado: " + createdCustomer);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
        } catch (IllegalArgumentException e) {
            System.out.println("ERROR: Datos inválidos al crear cliente: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.out.println("ERROR: Exception inesperada al crear cliente: " + e.getMessage());
            e.printStackTrace(); // Esto imprime el stacktrace en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el cliente.");
        }
    }
    // Nuevo endpoint: Listar clientes con cálculos (DTO)
    @GetMapping("/dto")
    public List<CustomerDTO> getAllCustomersWithCalculations() {
        return customerService.getAllCustomersWithCalculations();
    }

}
