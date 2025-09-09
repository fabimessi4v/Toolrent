package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.*;
import com.backend_tingeso.demo.repository.FeeRepository;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import com.backend_tingeso.demo.repository.ToolsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
@Service
public class LoansServiceImpl implements LoansService {
    private final LoansRepository loansRepository;
    private final KardexRepository kardexRepository;
    private final ToolsRepository toolsRepository;
    public LoansServiceImpl(LoansRepository loansRepository, KardexRepository kardexRepository, ToolsRepository toolsRepository) {
        this.loansRepository = loansRepository;
        this.kardexRepository = kardexRepository;
        this.toolsRepository = toolsRepository;
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
        kardex.setMovementDate(new Date());
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
    public Loans registerReturn(Long loanId, Date returnDate) {
        // 1. Buscar el préstamo
        Loans loan = loansRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("El préstamo no existe"));

        // 2. Actualizar estado y fecha de devolución
        loan.setStatus("RETURNED");
        loan.setReturnDate(returnDate);
        loansRepository.save(loan);

        // 3. Actualizar stock de la herramienta
        Tools tool = loan.getTool();
        tool.setStock(tool.getStock() + 1);
        toolsRepository.save(tool);

        // 4. Registrar movimiento en Kardex
        Kardex kardex = new Kardex();
        kardex.setCreatedAt(LocalDateTime.now());
        kardex.setType("RETURN");
        kardex.setTool(tool);
        kardex.setUsers(loan.getClient());
        kardex.setLoans(loan);
        kardexRepository.save(kardex);

        // 5. Retornar el préstamo actualizado
        return loan;
    }

    @Override
    public double calculateLateFee(Long loanId, Date actualReturnDate) {
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
}
