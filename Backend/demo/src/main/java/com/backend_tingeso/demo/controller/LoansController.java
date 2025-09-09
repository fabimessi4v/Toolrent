package com.backend_tingeso.demo.controller;

import ch.qos.logback.classic.Logger;
import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.CustomerRepository;
import com.backend_tingeso.demo.repository.ToolsRepository;
import com.backend_tingeso.demo.service.AuthService;
import com.backend_tingeso.demo.service.LoansService;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/loans")
public class LoansController {
    private static final Logger log = (Logger) LoggerFactory.getLogger(LoansController.class);

    private final LoansService loansService;
    private final ToolsRepository toolsRepository;
    private final CustomerRepository customerRepository;
    private final AuthService authService;

    public LoansController(
            LoansService loansService,
            ToolsRepository toolsRepository,
            CustomerRepository customerRepository,
            AuthService authService
    ) {
        this.loansService = loansService;
        this.toolsRepository = toolsRepository;
        this.customerRepository = customerRepository;
        this.authService = authService;
    }

    // DTO para solicitud de préstamo (sin userId)
    public static class LoanRequestDto {
        public String toolId;
        public String customerId;
        public Date deliveryDate;
        public Date dueDate;
    }

    @PostMapping
    public ResponseEntity<?> createLoan(@RequestBody LoanRequestDto loanRequest) {
        log.info("=== CONTROLLER REACHED FOR LOAN ===");
        log.info("Received loan DTO: {}", loanRequest);

        try {
            // Obtén usuario autenticado desde AuthService (lo crea si no existe)
            Users user = authService.getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Usuario autenticado no encontrado en base de datos");
            }

            Optional<Tools> toolOpt = toolsRepository.findById(loanRequest.toolId);
            Optional<Customer> customerOpt = customerRepository.findById(loanRequest.customerId);

            if (!toolOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Herramienta no encontrada: " + loanRequest.toolId);
            }
            if (!customerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Cliente no encontrado: " + loanRequest.customerId);
            }

            Loans newLoan = loansService.registerLoan(
                    user,
                    toolOpt.get(),
                    customerOpt.get(),
                    loanRequest.deliveryDate,
                    loanRequest.dueDate
            );

            log.info("Loan created successfully");
            return new ResponseEntity<>(newLoan, HttpStatus.CREATED);

        } catch (Exception ex) {
            log.error("Error in controller: ", ex);
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}