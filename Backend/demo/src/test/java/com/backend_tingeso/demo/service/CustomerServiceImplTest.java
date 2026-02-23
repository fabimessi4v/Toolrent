package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.CustomerDTO;
import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.repository.CustomerRepository;
import com.backend_tingeso.demo.repository.LoansRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerServiceImplTest {

    @Mock
    CustomerRepository customerRepository;

    @Mock
    LoansRepository loanRepository;

    @InjectMocks
    CustomerServiceImpl customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customerService = new CustomerServiceImpl(customerRepository, loanRepository);
    }

    @Test
    void getAllCustomers_returnsList() {
        List<Customer> customers = Arrays.asList(
                new Customer(),
                new Customer()
        );
        when(customerRepository.findAll()).thenReturn(customers);

        List<Customer> result = customerService.getAllCustomers();
        assertEquals(2, result.size());
    }

    @Test
    void createCustomer_successful() {
        Customer customer = new Customer();
        customer.setName("Juan");
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customer.setPhone("987654321");

        when(customerRepository.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));

        Customer saved = customerService.createCustomer(customer);
        assertNotNull(saved.getId());
        assertEquals("Activo", saved.getStatus());
        assertNotNull(saved.getCreatedAt());
    }

    @Test
    void createCustomer_nullCustomerThrows() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                customerService.createCustomer(null));
        assertTrue(ex.getMessage().contains("no puede ser nulo"));
    }

    @Test
    void createCustomer_blankNameThrows() {
        Customer customer = new Customer();
        customer.setName("");
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customer.setPhone("987654321");

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                customerService.createCustomer(customer));
        assertTrue(ex.getMessage().contains("nombre es obligatorio"));
    }

    @Test
    void createCustomer_blankRutThrows() {
        Customer customer = new Customer();
        customer.setName("Juan");
        customer.setRut("");
        customer.setEmail("juan@example.com");
        customer.setPhone("987654321");

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                customerService.createCustomer(customer));
        assertTrue(ex.getMessage().contains("RUT es obligatorio"));
    }

    @Test
    void createCustomer_blankEmailThrows() {
        Customer customer = new Customer();
        customer.setName("Juan");
        customer.setRut("12345678-9");
        customer.setEmail("");
        customer.setPhone("987654321");

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                customerService.createCustomer(customer));
        assertTrue(ex.getMessage().contains("email es obligatorio"));
    }

    @Test
    void createCustomer_blankPhoneThrows() {
        Customer customer = new Customer();
        customer.setName("Juan");
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customer.setPhone("");

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                customerService.createCustomer(customer));
        assertTrue(ex.getMessage().contains("teléfono es obligatorio"));
    }

    @Test
    void getAllCustomersWithCalculations_correctValues() {
        Customer c1 = new Customer();
        c1.setId("c1");
        c1.setName("Juan");
        c1.setEmail("juan@example.com");
        c1.setPhone("987654321");
        c1.setStatus("Activo");

        Customer c2 = new Customer();
        c2.setId("c2");
        c2.setName("Ana");
        c2.setEmail("ana@example.com");
        c2.setPhone("123456789");
        c2.setStatus("Activo");

        when(customerRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        Loans l1 = new Loans();
        l1.setCustomer(c1);
        l1.setStatus("ACTIVE");
        l1.setFine(5f);

        Loans l2 = new Loans();
        l2.setCustomer(c1);
        l2.setStatus("RETURNED");
        l2.setFine(null);

        Loans l3 = new Loans();
        l3.setCustomer(c2);
        l3.setStatus("ACTIVE");
        l3.setFine(null);

        when(loanRepository.findByCustomer_Id("c1")).thenReturn(Arrays.asList(l1, l2));
        when(loanRepository.findByCustomer_Id("c2")).thenReturn(List.of(l3));

        List<CustomerDTO> dtos = customerService.getAllCustomersWithCalculations();
        assertEquals(2, dtos.size());
        CustomerDTO dto1 = dtos.stream().filter(d -> d.getId().equals("c1")).findFirst().orElseThrow();
        assertEquals(2, dto1.getTotalLoans());
        assertEquals(1, dto1.getActiveLoans());
        assertEquals(1, dto1.getUnpaidFines());

        CustomerDTO dto2 = dtos.stream().filter(d -> d.getId().equals("c2")).findFirst().orElseThrow();
        assertEquals(1, dto2.getTotalLoans());
        assertEquals(1, dto2.getActiveLoans());
        assertEquals(0, dto2.getUnpaidFines());
    }

    @Test
    void getCustomerDTOById_returnsNullIfNotFound() {
        when(customerRepository.findById("c1")).thenReturn(Optional.empty());
        CustomerDTO dto = customerService.getCustomerDTOById("c1");
        assertNull(dto);
    }

    @Test
    void getCustomerDTOById_returnsCorrectDTO() {
        Customer c1 = new Customer();
        c1.setId("c1");
        c1.setName("Juan");
        c1.setEmail("juan@example.com");
        c1.setPhone("987654321");
        c1.setStatus("Activo");

        when(customerRepository.findById("c1")).thenReturn(Optional.of(c1));

        Loans l1 = new Loans();
        l1.setCustomer(c1);
        l1.setStatus("ACTIVE");
        l1.setFine(5f);

        Loans l2 = new Loans();
        l2.setCustomer(c1);
        l2.setStatus("RETURNED");
        l2.setFine(null);

        when(loanRepository.findByCustomer_Id("c1")).thenReturn(Arrays.asList(l1, l2));

        CustomerDTO dto = customerService.getCustomerDTOById("c1");
        assertNotNull(dto);
        assertEquals("c1", dto.getId());
        assertEquals(2, dto.getTotalLoans());
        assertEquals(1, dto.getActiveLoans());
        assertEquals(1, dto.getUnpaidFines());
    }
}