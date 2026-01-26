package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.entity.enums.MovementType;
import com.backend_tingeso.demo.repository.KardexRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class KardexServiceImplTest {

    @Mock
    KardexRepository kardexRepository;
    @Mock
    UsersRepository usersRepository;

    @InjectMocks
    KardexServiceImpl kardexService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        kardexService = new KardexServiceImpl(kardexRepository, usersRepository);
    }

    @Test
    void createKardex_successful() {
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setName("Martillo");

        Users user = new Users();
        user.setId("u1");
        user.setUsername("admin");

        Loans loan = new Loans();

        when(kardexRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() ->
                kardexService.createKardex(tool, user, loan, MovementType.valueOf("LOAN"), 1, "Prueba kardex")
        );
        // Verifica que se llama al método save en el repositorio
        verify(kardexRepository, times(1)).save(any(Kardex.class));
    }

    @Test
    void createKardex_guardaUsuarioSiNoTieneId() {
        Tools tool = new Tools();
        tool.setId("t2");
        tool.setName("Sierra");

        Users user = new Users();
        user.setUsername("nuevo");
        user.setId(null);

        Users savedUser = new Users();
        savedUser.setId("u2");
        savedUser.setUsername("nuevo");

        Loans loan = new Loans();

        when(usersRepository.save(any())).thenReturn(savedUser);
        when(kardexRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() ->
                kardexService.createKardex(tool, user, loan, MovementType.valueOf("LOAN"), 1, "Nuevo usuario")
        );
        verify(usersRepository, times(1)).save(any(Users.class));
        verify(kardexRepository, times(1)).save(any(Kardex.class));
    }

    @Test
    void createKardex_errorSiToolONulo() {
        Users user = new Users();
        user.setId("u1");
        user.setUsername("admin");
        Loans loan = new Loans();

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(null, user, loan, MovementType.valueOf("LOAN"), 1, "Prueba")
        );
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiUserONulo() {
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setName("Martillo");
        Loans loan = new Loans();

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, null, loan, MovementType.valueOf("LOAN"), 1, "Prueba")
        );
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiTypeVacio() {
        Tools tool = new Tools();
        tool.setId("t1");
        Users user = new Users();
        user.setId("u1");
        Loans loan = new Loans();

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, user, loan, MovementType.valueOf(""), 1, "Prueba")
        );
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiQuantityMenorOIgualACero() {
        Tools tool = new Tools();
        tool.setId("t1");
        Users user = new Users();
        user.setId("u1");
        Loans loan = new Loans();

        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, user, loan, MovementType.valueOf("LOAN"), 0, "Prueba")
        );
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

}

