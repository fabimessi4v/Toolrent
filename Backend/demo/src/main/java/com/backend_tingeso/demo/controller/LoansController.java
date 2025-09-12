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
import com.backend_tingeso.demo.service.LoansServiceImpl;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
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
    @GetMapping
    public ResponseEntity<List<LoansServiceImpl.LoansDTO>> getAllLoans() {
        try {
            List<LoansServiceImpl.LoansDTO> loansList = loansService.getLoans();
            return ResponseEntity.ok(loansList);
        } catch (Exception ex) {
            log.error("Error fetching loans: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{loanId}/return")
    public ResponseEntity<?> returnLoan(@PathVariable String loanId) {
        try {
            Date returnDate = new Date(); // fecha actual
            Loans updatedLoan = loansService.registerReturn(loanId, returnDate);

            // Mapeo a DTO (puedes extraer a un método si quieres)
            LoansServiceImpl.LoansDTO dto = new LoansServiceImpl.LoansDTO(
                    updatedLoan.getId(),
                    updatedLoan.getTool() != null ? updatedLoan.getTool().getName() : null,
                    updatedLoan.getCustomer() != null ? updatedLoan.getCustomer().getName() : null,
                    updatedLoan.getClient() != null ? updatedLoan.getClient().getUsername() : null,
                    updatedLoan.getDeliveryDate(),
                    updatedLoan.getDueDate(),
                    updatedLoan.getReturnDate(),
                    updatedLoan.getStatus(),
                    updatedLoan.getFine()
            );

            return ResponseEntity.ok(dto);

        } catch (IllegalArgumentException ex) {
            // Si el préstamo no existe, responde 404 y con mensaje legible
            return ResponseEntity.status(404).body(
                    java.util.Collections.singletonMap("message", ex.getMessage())
            );
        } catch (Exception ex) {
            // Otros errores
            return ResponseEntity.status(400).body(
                    java.util.Collections.singletonMap("message", ex.getMessage())
            );
        }
    }

}