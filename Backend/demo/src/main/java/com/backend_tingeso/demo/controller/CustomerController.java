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
    public ResponseEntity<Object> createCustomer(@RequestBody Customer customer) {
        try {
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el cliente.");
        }
    }
    // Nuevo endpoint: Listar clientes con cálculos (DTO)
    @GetMapping("/dto")
    public List<CustomerDTO> getAllCustomersWithCalculations() {
        return customerService.getAllCustomersWithCalculations();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCustomer(@PathVariable String id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok("Cliente eliminado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar cliente.");
        }
    }

}
