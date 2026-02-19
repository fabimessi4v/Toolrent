package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.dto.CustomerDTO;
import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.repository.CustomerRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Esta clase contiene la lógica real. Implementa la interfaz y usa el CustomerRepository para interactuar con la base de datos.
 *
 *
 */
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final LoansRepository loanRepository;

    // Spring automáticamente nos "pasa" una instancia de CustomerRepository.
    public CustomerServiceImpl(CustomerRepository customerRepository, LoansRepository loanRepository) {
        this.customerRepository = customerRepository;
        this.loanRepository = loanRepository;
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

    @Override
    public List<CustomerDTO> getAllCustomersWithCalculations() {
        // Busca todos los clientes en la base de datos
        List<Customer> customers = customerRepository.findAll();

        // Por cada cliente, crea un DTO y calcula sus valores extra
        return customers.stream().map(customer -> {
            CustomerDTO dto = new CustomerDTO();

            // Copia los datos básicos del cliente al DTO
            dto.setId(customer.getId());
            dto.setName(customer.getName());
            dto.setEmail(customer.getEmail());
            dto.setPhone(customer.getPhone());
            dto.setStatus(customer.getStatus());

            // Obtiene todos los préstamos (loans) asociados al cliente
            List<Loans> loans = loanRepository.findByCustomerId(customer.getId());
            // Total de préstamos
            dto.setTotalLoans(loans.size());
            // Préstamos activos
            dto.setActiveLoans((int) loans.stream().filter(l -> l.getStatus().equals("ACTIVE")).count());
            // Revisar si alguno de los préstamos tiene una multa asociada (fine != null)
            boolean hasFine = loans.stream().anyMatch(loan -> loan.getFine() != null);
            // Si tiene multa, asigna 1, si no, 0
            dto.setUnpaidFines(hasFine ? 1 : 0);

            // Devuelve el DTO para este cliente
            return dto;
        }).collect(Collectors.toList()); // Convierte el stream de DTOs en una lista
    }

    @Override
    public CustomerDTO getCustomerDTOById(String customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) return null;

        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setStatus(customer.getStatus());

        // Préstamos y cálculos
        List<Loans> loans = loanRepository.findByCustomerId(customer.getId());
        dto.setTotalLoans(loans.size());
        dto.setActiveLoans((int) loans.stream().filter(l -> l.getStatus().equals("ACTIVE")).count());

        // Multa impaga: 1 si tiene multa, 0 si no
        boolean hasUnpaidFine = loans.stream()
                .anyMatch(loan ->
                        loan.getFine() != null &&
                                loan.getFine() > 0);
        dto.setUnpaidFines(hasUnpaidFine ? 1 : 0);

        return dto;
    }
    @Override
    public void deleteCustomer(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new IllegalArgumentException("El id es obligatorio.");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no existe."));

        // no borrar si tiene préstamos activos
        List<Loans> loans = loanRepository.findByCustomerId(customerId);

        boolean hasActiveLoans = loans.stream()
                .anyMatch(l -> "ACTIVE".equals(l.getStatus()));

        if (hasActiveLoans) {
            throw new IllegalStateException("No se puede eliminar cliente con préstamos activos.");
        }
        if (!loans.isEmpty()) {
            throw new IllegalStateException("No se puede eliminar cliente con préstamos.");
        }

        customerRepository.delete(customer);
    }


}
