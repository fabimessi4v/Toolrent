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
    void createKardex_errorSiToolNulo() { // Nombre sugerido según el código
        Users user = new Users();
        user.setId("u1");
        user.setUsername("admin");
        Loans loan = new Loans();

        // 1. Preparamos los parámetros FUERA del assertThrows
        MovementType type = MovementType.valueOf("LOAN");

        // 2. El assertThrows ahora solo tiene una invocación
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(null, user, loan, type, 1, "Prueba")
        );

        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiUserONulo() {
        // 1. Arrange (Organizar): Preparamos todo fuera del assert
        Tools tool = new Tools();
        tool.setId("t1");
        tool.setName("Martillo");
        Loans loan = new Loans();
        MovementType type = MovementType.valueOf("LOAN"); // <--- Sacamos esto del lambda

        // 2. Act (Actuar): El assert solo contiene la llamada al servicio
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, null, loan, type, 1, "Prueba")
        );

        // 3. Assert (Verificar)
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiTypeVacio() {
        // 1. Arrange (Preparación)
        Tools tool = new Tools();
        tool.setId("t1");
        Users user = new Users();
        user.setId("u1");
        Loans loan = new Loans();

        // Si realmente quieres probar qué pasa cuando el tipo es nulo o inválido en tu servicio,
        // es mejor pasar directamente el valor problemático al servicio.

        // 2. Act (Acción) - Solo una invocación dentro de la lambda
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, user, loan, null, 1, "Prueba")
        );

        // 3. Assert (Verificación)
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

    @Test
    void createKardex_errorSiQuantityMenorOIgualACero() {
        // 1. Arrange: Preparamos los objetos y el Enum fuera
        Tools tool = new Tools();
        tool.setId("t1");
        Users user = new Users();
        user.setId("u1");
        Loans loan = new Loans();
        MovementType type = MovementType.valueOf("LOAN"); // <--- Fuera de la lambda

        // 2. Act: Solo el llamado al servicio dentro del assertThrows
        Exception ex = assertThrows(IllegalArgumentException.class, () ->
                kardexService.createKardex(tool, user, loan, type, 0, "Prueba")
        );

        // 3. Assert: Verificamos el mensaje
        assertTrue(ex.getMessage().contains("Tool, User, type y quantity"));
    }

}

