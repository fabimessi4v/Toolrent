package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.CustomerDTO;
import com.backend_tingeso.demo.entity.*;
import com.backend_tingeso.demo.repository.FeeRepository;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import com.backend_tingeso.demo.repository.ToolsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoansServiceImplTest {

    @Mock
    LoansRepository loansRepository;
    @Mock
    KardexRepository kardexRepository;
    @Mock
    ToolsRepository toolsRepository;
    @Mock
    FeeRepository feeRepository;
    @Mock
    CustomerService customerService;

    @InjectMocks
    LoansServiceImpl loansService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loansService = new LoansServiceImpl(loansRepository, kardexRepository, toolsRepository, feeRepository, customerService);
    }

    @Test
    void registerLoan_successful() {
        Users user = new Users();
        user.setId("u1");
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setStock(2);
        Customer customer = new Customer();
        customer.setId("c1");
        Date deliveryDate = new Date();
        Date dueDate = new Date(deliveryDate.getTime() + 86400000); // +1 day

        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setUnpaidFines(0);
        when(customerService.getCustomerDTOById(customer.getId())).thenReturn(customerDTO);
        when(loansRepository.countActiveLoansByCustomerId(customer.getId())).thenReturn(2);
        when(toolsRepository.findById(tool.getId())).thenReturn(Optional.of(tool));
        when(toolsRepository.save(any())).thenReturn(tool);
        when(loansRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(kardexRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Loans loan = loansService.registerLoan(user, tool, customer, deliveryDate, dueDate);

        assertNotNull(loan);
        assertEquals("ACTIVE", loan.getStatus());
        assertEquals(customer, loan.getCustomer());
    }

    @Test
    void registerLoan_failsDueToUnpaidFine() {
        Users user = new Users();
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setStock(2);
        Customer customer = new Customer();
        customer.setId("c1");
        Date deliveryDate = new Date();
        Date dueDate = new Date(deliveryDate.getTime() + 86400000);

        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setUnpaidFines(1);
        when(customerService.getCustomerDTOById(customer.getId())).thenReturn(customerDTO);

        Exception ex = assertThrows(IllegalStateException.class, () ->
                loansService.registerLoan(user, tool, customer, deliveryDate, dueDate));
        assertTrue(ex.getMessage().contains("multas impagas"));
    }

    @Test
    void validateAvailability_trueWhenStockPositive() {
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setStock(2);
        when(toolsRepository.findById(tool.getId())).thenReturn(Optional.of(tool));
        assertTrue(loansService.validateAvailability(tool.getId()));
    }

    @Test
    void validateAvailability_falseWhenNoStock() {
        Tools tool = new Tools();
        tool.setId("t2");
        tool.setStock(0);
        when(toolsRepository.findById(tool.getId())).thenReturn(Optional.of(tool));
        assertFalse(loansService.validateAvailability(tool.getId()));
    }

    @Test
    void registerReturn_successful() {
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setStock(2);

        Users user = new Users();
        user.setId("u1");

        Loans loan = new Loans();
        loan.setId("l1");
        loan.setTool(tool);
        loan.setClient(user);
        loan.setDeliveryDate(new Date(System.currentTimeMillis() - 2 * 86400000)); // entregado hace 2 días
        loan.setDueDate(new Date(System.currentTimeMillis() - 86400000)); // vencía ayer
        loan.setStatus("ACTIVE");

        when(loansRepository.findById(loan.getId())).thenReturn(Optional.of(loan));
        when(loansRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(toolsRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(kardexRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        Fee lateFee = new Fee();
        lateFee.setType("LATE_FEE");
        lateFee.setValue((int) 50.0);
        when(feeRepository.findByType("LATE_FEE")).thenReturn(Optional.of(lateFee));

        Date returnDate = new Date();
        Loans returnedLoan = loansService.registerReturn(loan.getId(), returnDate);

        assertEquals("RETURNED", returnedLoan.getStatus());
        assertNotNull(returnedLoan.getReturnDate());
        assertTrue(tool.getStock() > 1);
    }

    @Test
    void calculateLateFee_returnsZeroIfNoDelay() {
        Loans loan = new Loans();
        loan.setId("l2");
        Date dueDate = new Date();
        loan.setDueDate(dueDate);
        when(loansRepository.findById(loan.getId())).thenReturn(Optional.of(loan));

        double fee = loansService.calculateLateFee(loan.getId(), dueDate);
        assertEquals(0.0, fee);
    }

    @Test
    void getLoans_returnsMappedDTOs() {
        Loans loan1 = new Loans();
        loan1.setId("l1");
        Tools tool = new Tools();
        tool.setName("Martillo");
        loan1.setTool(tool);
        Customer cust = new Customer();
        cust.setName("Juan");
        loan1.setCustomer(cust);
        Users user = new Users();
        user.setUsername("admin");
        loan1.setClient(user);
        loan1.setDeliveryDate(new Date());
        loan1.setDueDate(new Date());
        loan1.setReturnDate(null);
        loan1.setStatus("ACTIVE");
        loan1.setFine(0f);

        when(loansRepository.findAll()).thenReturn(Collections.singletonList(loan1));

        List<LoansServiceImpl.LoansDTO> dtos = loansService.getLoans();
        assertEquals(1, dtos.size());
        assertEquals("Martillo", dtos.get(0).toolName);
        assertEquals("Juan", dtos.get(0).customerName);
        assertEquals("admin", dtos.get(0).userName);
    }
}