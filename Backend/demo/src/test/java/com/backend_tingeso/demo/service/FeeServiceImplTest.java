package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Fee;
import com.backend_tingeso.demo.repository.FeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FeeServiceImplTest {

    @Mock
    FeeRepository feeRepository;

    @InjectMocks
    FeeServiceImpl feeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        feeService = new FeeServiceImpl(feeRepository);
    }

    @Test
    void getByType_successful() {
        Fee fee = new Fee();
        fee.setId("f1");
        fee.setType("LATE_FEE");
        fee.setValue(100);
        fee.setCreatedAt(LocalDateTime.now());

        when(feeRepository.findByType("LATE_FEE")).thenReturn(Optional.of(fee));

        FeeServiceImpl.FeeDto result = feeService.getByType("LATE_FEE");
        assertEquals("f1", result.getId());
        assertEquals("LATE_FEE", result.getType());
        assertEquals(100, result.getValue());
        assertNotNull(result.getCreatedAt());
    }

    @Test
    void getByType_throwsIfTypeInvalid() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                feeService.getByType("INVALID_TYPE"));
        assertTrue(ex.getMessage().contains("Tipo no permitido"));
    }

    @Test
    void getByType_throwsIfNotFound() {
        when(feeRepository.findByType("LATE_FEE")).thenReturn(Optional.empty());
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                feeService.getByType("LATE_FEE"));
        assertTrue(ex.getMessage().contains("No existe tarifa"));
    }

    @Test
    void upsert_createsNewFeeIfNotExists() {
        when(feeRepository.findByType("LATE_FEE")).thenReturn(Optional.empty());
        Fee saved = new Fee();
        saved.setId("f2");
        saved.setType("LATE_FEE");
        saved.setValue(200);
        saved.setCreatedAt(LocalDateTime.now());

        when(feeRepository.save(any(Fee.class))).thenReturn(saved);

        FeeServiceImpl.FeeDto result = feeService.upsert("LATE_FEE", 200);
        assertEquals("f2", result.getId());
        assertEquals("LATE_FEE", result.getType());
        assertEquals(200, result.getValue());
    }

    @Test
    void upsert_updatesFeeIfExists() {
        Fee existing = new Fee();
        existing.setId("f3");
        existing.setType("LATE_FEE");
        existing.setValue(100);
        existing.setCreatedAt(LocalDateTime.now());

        when(feeRepository.findByType("LATE_FEE")).thenReturn(Optional.of(existing));
        when(feeRepository.save(any(Fee.class))).thenAnswer(inv -> inv.getArgument(0));

        FeeServiceImpl.FeeDto result = feeService.upsert("LATE_FEE", 300);
        assertEquals("f3", result.getId());
        assertEquals("LATE_FEE", result.getType());
        assertEquals(300, result.getValue());
    }

    @Test
    void upsert_throwsIfTypeInvalid() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                feeService.upsert("NO_FEE", 100));
        assertTrue(ex.getMessage().contains("Tipo no permitido"));
    }

    @Test
    void upsert_throwsIfValueNull() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                feeService.upsert("LATE_FEE", null));
        assertTrue(ex.getMessage().contains("Valor requerido"));
    }

    @Test
    void upsert_throwsIfValueNegative() {
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                feeService.upsert("LATE_FEE", -10));
        assertTrue(ex.getMessage().contains("El valor no puede ser negativo"));
    }
}