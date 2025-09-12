package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;

import java.util.Date;
import java.util.List;

public interface LoansService {
    // RF2.1: Registrar un préstamo asociando cliente y herramienta, con fecha de entrega y devolución. Actualiza el kardex.
     Loans registerLoan(Users user, Tools tool, Customer customer, Date deliveryDate, Date dueDate);
    // RF2.2: Validar disponibilidad antes de autorizar el préstamo.
    boolean validateAvailability(String toolId);
    // RF2.3: Registrar devolución de herramienta, actualizando estado, stock y kardex.
    public Loans registerReturn(String loanId, Date returnDate);

    // RF2.4: Calcular automáticamente multas por atraso (tarifa diaria).
    double calculateLateFee(String loanId, Date actualReturnDate);
    List<LoansServiceImpl.LoansDTO> getLoans();

}

