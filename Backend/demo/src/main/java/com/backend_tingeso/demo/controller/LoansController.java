package com.backend_tingeso.demo.controller;

import ch.qos.logback.classic.Logger;
import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.entity.enums.ToolCondition;
import com.backend_tingeso.demo.repository.CustomerRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import com.backend_tingeso.demo.repository.ToolsRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import com.backend_tingeso.demo.service.AuthService;
import com.backend_tingeso.demo.service.LoansService;
import com.backend_tingeso.demo.service.LoansServiceImpl;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    private final LoansRepository loansRepository;
    private final UsersRepository usersRepository;

    public LoansController(
            LoansService loansService,
            ToolsRepository toolsRepository,
            CustomerRepository customerRepository,
            AuthService authService, LoansRepository loansRepository,
            UsersRepository usersRepository) {
        this.loansService = loansService;
        this.toolsRepository = toolsRepository;
        this.customerRepository = customerRepository;
        this.authService = authService;
        this.loansRepository = loansRepository;
        this.usersRepository = usersRepository;
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
        log.info("=== MODO DESARROLLO: Saltando Seguridad ===");

        try {
            // 1. SIMULACIÓN: En lugar de buscar el usuario real, buscamos uno fijo de tu BD
            // Asegúrate de que el ID 1 o el email existan en tu tabla 'users'
            Users user = usersRepository.findById("user-dev-001")
                    .orElseThrow(() -> new RuntimeException("Usuario de prueba no encontrado"));

            Optional<Tools> toolOpt = toolsRepository.findById(loanRequest.toolId);
            Optional<Customer> customerOpt = customerRepository.findById(loanRequest.customerId);

            if (!toolOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Herramienta no encontrada");
            }
            if (!customerOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no encontrado");
            }

            Loans newLoan = loansService.registerLoan(
                    user,
                    toolOpt.get(),
                    customerOpt.get(),
                    loanRequest.deliveryDate,
                    loanRequest.dueDate
            );

            return new ResponseEntity<>(newLoan, HttpStatus.CREATED);

        } catch (Exception ex) {
            log.error("Error in controller: ", ex);
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllLoans() {
        log.info("===> Iniciando obtención de loans...");
        List<Loans> loans;
        try {
            loans = loansRepository.findAll();
            log.info("Cantidad de loans obtenidos: {}", loans.size());
        } catch (Exception ex) {
            log.error("Error al obtener lista de loans: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener lista de loans: " + ex.getMessage());
        }

        List<LoansServiceImpl.LoansDTO> loansList = new ArrayList<>();
        for (Loans loan : loans) {
            try {
                log.info("----------");
                log.info("Probando loan id: {}", loan.getId());
                log.info("deliveryDate: {}", loan.getDeliveryDate());
                log.info("dueDate: {}", loan.getDueDate());
                log.info("returnDate: {}", loan.getReturnDate());
                log.info("tool: {}", loan.getTool() != null ? loan.getTool().getName() : null);
                log.info("customer: {}", loan.getCustomer() != null ? loan.getCustomer().getName() : null);
                log.info("client: {}", loan.getClient() != null ? loan.getClient().getUsername() : null);
                log.info("status: {}", loan.getStatus());
                log.info("fine: {}", loan.getFine());

                LoansServiceImpl.LoansDTO dto = loansService.toDTO(loan);
                log.info("DTO creado exitosamente para id: {}", loan.getId());
                loansList.add(dto);

            } catch (Exception ex) {
                log.error("Error para loan id {}: {}", loan.getId(), ex.getMessage());
                // Puedes guardar el ID en una lista si quieres luego mostrar todos los corruptos
            }
        }

        log.info("Cantidad de loans mapeados correctamente: {}", loansList.size());
        return ResponseEntity.ok(loansList);
    }
    @PutMapping("/{loanId}/return")
    public ResponseEntity<?> returnLoan(@PathVariable String loanId, @RequestParam(required = false, defaultValue = "OK") ToolCondition condition) {
        try {
            Date returnDate = new Date(); // fecha actual
            Loans updatedLoan = loansService.registerReturn(loanId, returnDate, condition);

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
    @GetMapping("/{id}")
    public ResponseEntity<?> getLoanById(@PathVariable String id) {
        try {
            Loans loan = loansRepository.findById(id).orElse(null);
            if (loan == null) return ResponseEntity.notFound().build();

            // Logea todos los campos
            log.info("ID: " + loan.getId());
            log.info("deliveryDate: " + loan.getDeliveryDate());
            log.info("dueDate: " + loan.getDueDate());
            log.info("returnDate: " + loan.getReturnDate());
            log.info("tool: " + (loan.getTool() != null ? loan.getTool().getName() : null));
            log.info("customer: " + (loan.getCustomer() != null ? loan.getCustomer().getName() : null));
            log.info("client: " + (loan.getClient() != null ? loan.getClient().getUsername() : null));
            log.info("status: " + loan.getStatus());
            log.info("fine: " + loan.getFine());

            // Aquí puedes logear el DTO también si lo usas
            LoansServiceImpl.LoansDTO dto = loansService.toDTO(loan);
            log.info("DTO: " + dto);

            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            log.error("Error al obtener loan por ID: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

}