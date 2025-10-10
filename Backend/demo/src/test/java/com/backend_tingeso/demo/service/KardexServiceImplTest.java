package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Kardex;
import com.backend_tingeso.demo.entity.Loans;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
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
                kardexService.createKardex(tool, user, loan, "LOAN", 1, "Prueba kardex")
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
                kardexService.createKardex(tool, user, loan, "LOAN", 1, "Nuevo usuario")
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
                kardexService.createKardex(null, user, loan, "LOAN", 1, "Prueba")
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
                kardexService.createKardex(tool, null, loan, "LOAN", 1, "Prueba")
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
                kardexService.createKardex(tool, user, loan, "", 1, "Prueba")
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
                kardexService.createKardex(tool, user, loan, "LOAN", 0, "Prueba")
        );
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void getAllKardex_devuelveDTOsCorrectos() {
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setName("Martillo");

        Users user = new Users();
        user.setId("u1");
        user.setUsername("admin");

        Kardex kardex = new Kardex();
        kardex.setId("k1");
        kardex.setTool(tool);
        kardex.setUsers(user);
        kardex.setType("LOAN");
        kardex.setQuantity(1);
        kardex.setMovementDate(LocalDate.of(2025, 10, 3));
        kardex.setComments("Prueba");

        when(kardexRepository.findAll()).thenReturn(Collections.singletonList(kardex));

        List<KardexServiceImpl.KardexDTO> kardexDTOs = kardexService.getAllKardex();
        assertEquals(1, kardexDTOs.size());
        assertEquals("k1", kardexDTOs.get(0).id);
        assertEquals("Martillo", kardexDTOs.get(0).toolName);
        assertEquals("admin", kardexDTOs.get(0).userName);
        assertEquals("LOAN", kardexDTOs.get(0).type);
        assertEquals(1, kardexDTOs.get(0).quantity);
        assertEquals(LocalDate.of(2025, 10, 3), kardexDTOs.get(0).movementDate);
        assertEquals("Prueba", kardexDTOs.get(0).comments);
    }
}