package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.*;
import com.backend_tingeso.demo.repository.FeeRepository;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import com.backend_tingeso.demo.repository.ToolsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class LoansServiceImpl implements LoansService {
    private final LoansRepository loansRepository;
    private final KardexRepository kardexRepository;
    private final ToolsRepository toolsRepository;
    private final FeeRepository FeeRepository;
    public LoansServiceImpl(LoansRepository loansRepository, KardexRepository kardexRepository, ToolsRepository toolsRepository, com.backend_tingeso.demo.repository.FeeRepository feeRepository) {
        this.loansRepository = loansRepository;
        this.kardexRepository = kardexRepository;
        this.toolsRepository = toolsRepository;
        FeeRepository = feeRepository;
    }
    // DTO para préstamo
    public static class LoansDTO {
        public String id;
        public String toolName;
        public String customerName;
        public String userName;
        public Date deliveryDate;
        public Date dueDate;
        public Date returnDate;
        public String status;
        public Float fine;

        public LoansDTO(String id, String toolName, String customerName, String userName,
                        Date deliveryDate, Date dueDate, Date returnDate, String status, Float fine) {
            this.id = id;
            this.toolName = toolName;
            this.customerName = customerName;
            this.userName = userName;
            this.deliveryDate = deliveryDate;
            this.dueDate = dueDate;
            this.returnDate = returnDate;
            this.status = status;
            this.fine = fine;
        }
    }

    // Mapear entidad Loans a DTO (ahora es público)
    public LoansDTO toDTO(Loans loan) {
        return new LoansDTO(
                loan.getId(),
                loan.getTool() != null ? loan.getTool().getName() : null,
                loan.getCustomer() != null ? loan.getCustomer().getName() : null,
                loan.getClient() != null ? loan.getClient().getUsername() : null,
                loan.getDeliveryDate(),
                loan.getDueDate(),
                loan.getReturnDate(),
                loan.getStatus(),
                loan.getFine()
        );
    }

    @Override
    public Loans registerLoan(Users user, Tools tool, Customer customer, Date deliveryDate, Date dueDate) {
        if (!validateAvailability(tool.getId().toString())) {
            throw new IllegalStateException("La herramienta no tiene stock disponible para préstamo.");
        }
        // 1. Construir el objeto Loans
        Loans loan = new Loans();
        loan.setId(String.valueOf(UUID.randomUUID()));
        loan.setClient(user);
        loan.setTool(tool);
        loan.setCustomer(customer);
        loan.setDeliveryDate(deliveryDate);
        loan.setDueDate(dueDate);
        loan.setStatus("ACTIVE");
        loan.setFine(0f);

        // 2. Guardar en la base de datos
        Loans nuevoPrestamo = loansRepository.save(loan);

        // 3. Crear registro en el Kardex
        Kardex kardex = new Kardex();
        kardex.setId(UUID.randomUUID().toString());
        kardex.setCreatedAt(LocalDateTime.now());
        kardex.setType("LOAN");
        kardex.setTool(tool);
        kardex.setUsers(user);
        kardex.setLoans(nuevoPrestamo);
        kardex.setMovementDate(java.time.LocalDate.now());
        kardex.setQuantity(1);
        kardexRepository.save(kardex);

        // 4. Retornar el préstamo creado
        return nuevoPrestamo;
    }

    @Override
    /**
     * Valida si una herramienta tiene stock disponible (>0).
     *
     * @param toolId ID de la herramienta
     * @return true si el stock es mayor a 0, false en caso contrario
     */
    public boolean validateAvailability(String toolId) {
        Tools tool = toolsRepository.findById(toolId)
                .orElseThrow(() -> new IllegalArgumentException("La herramienta no existe"));

        return tool.getStock() != null && tool.getStock() > 0;
    }

    @Override
    public Loans registerReturn(String loanId, Date returnDate) {
        Loans loan = loansRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("El préstamo no existe"));

        loan.setStatus("RETURNED");
        loan.setReturnDate(returnDate);
        // Calcular multa y guardar en el préstamo
        float multa = (float) calculateLateFee(loanId, returnDate);
        loan.setFine(multa);

        loansRepository.save(loan);

        Tools tool = loan.getTool();
        tool.setStock(tool.getStock() + 1);
        toolsRepository.save(tool);

        Kardex kardex = new Kardex();
        kardex.setId(UUID.randomUUID().toString());
        kardex.setCreatedAt(LocalDateTime.now());
        kardex.setMovementDate(LocalDate.now());
        kardex.setType("RETURN");
        kardex.setTool(tool);
        kardex.setUsers(loan.getClient());
        kardex.setQuantity(1);
        kardexRepository.save(kardex);

        return loan;
    }

    @Override
    public double calculateLateFee(String loanId, Date actualReturnDate) {
        // 1. Buscar el préstamo
        Loans loan = loansRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("El préstamo no existe"));

        Date dueDate = loan.getDueDate();

        // 2. Calcular días de atraso
        long diff = actualReturnDate.getTime() - dueDate.getTime(); // diferencia en milisegundos
        long diasAtraso = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

        if (diasAtraso <= 0) {
            return 0f; // no hay multa
        }

        // 2. Obtener tarifa diaria de multa
        Fee multaTarifa = FeeRepository.findByType("LATE_FEE")
                .orElseThrow(() -> new IllegalStateException("Tarifa de multa no configurada"));

        // 3. Calcular multa
        return diasAtraso * multaTarifa.getValue();
    }

    @Override
    public List<LoansDTO> getLoans() {
        return loansRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}