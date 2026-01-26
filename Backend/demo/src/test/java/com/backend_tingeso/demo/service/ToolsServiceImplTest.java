package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.dto.ToolRankingDTO;
import com.backend_tingeso.demo.entity.enums.MovementType;
import com.backend_tingeso.demo.repository.ToolsRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ToolsServiceImplTest {

    @Mock
    private ToolsRepository toolsRepository;
    @Mock
    private KardexService kardexService;
    @Mock
    private AuthService authService;

    @InjectMocks
    private ToolsServiceImpl toolsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void createTool_validaDatosYGuardaTool() {
        // Arrange
        Tools tool = new Tools();
        tool.setName("Martillo");
        tool.setCategory("Manuales");
        tool.setReplacementValue(BigDecimal.valueOf(1000.0));
        tool.setStatus("Disponible");

        Users user = new Users();
        user.setId("123");
        user.setUsername("admin");
        user.setRole("ADMIN");

        when(authService.getCurrentUser()).thenReturn(user);
        when(toolsRepository.saveAndFlush(any(Tools.class))).thenAnswer(invocation -> {
            Tools t = invocation.getArgument(0);
            if (t.getId() == null) t.setId("generated-id");
            return t;
        });

        // Act
        Tools result = toolsService.createTool(tool);

        // Assert
        assertNotNull(result.getId());
        verify(kardexService).createKardex(
                any(Tools.class),
                eq(user),
                isNull(),
                eq(MovementType.ENTRADA),  // Usar el tipo enum correcto según tu lógica
                eq(1),
                eq("")
        );
    }

    @Test
    void createTool_estadoInvalido_lanzaExcepcion() {
        Tools tool = new Tools();
        tool.setName("Martillo");
        tool.setCategory("Manuales");
        tool.setReplacementValue(BigDecimal.valueOf(1000.0));
        tool.setStatus("NoPermitido");

        Users user = new Users();
        user.setId("123");
        user.setUsername("admin");
        user.setRole("ADMIN");

        when(authService.getCurrentUser()).thenReturn(user);

        assertThrows(IllegalArgumentException.class, () -> toolsService.createTool(tool));
    }

    @Test
    void getAllTools_retornaLista() {
        List<Tools> mockList = List.of(new Tools(), new Tools());
        when(toolsRepository.findAll()).thenReturn(mockList);

        List<Tools> result = toolsService.getAllTools();

        assertEquals(2, result.size());
        verify(toolsRepository).findAll();
    }

    @Test
    void deleteTool_usuarioNoAdmin_lanzaExcepcion() {
        Users user = new Users();
        user.setRole("USER");
        when(authService.getCurrentUser()).thenReturn(user);

        assertThrows(SecurityException.class, () -> toolsService.deleteTool(UUID.randomUUID().toString()));
    }

    @Test
    void deleteTool_idValido_yExisteElimina() {
        Users user = new Users();
        user.setRole("ADMIN");
        when(authService.getCurrentUser()).thenReturn(user);

        String id = UUID.randomUUID().toString();
        when(toolsRepository.existsById(id)).thenReturn(true);

        boolean result = toolsService.deleteTool(id);

        assertTrue(result);
        verify(toolsRepository).deleteById(id);
    }

    @Test
    void deleteTool_idInvalido_noElimina() {
        Users user = new Users();
        user.setRole("ADMIN");
        when(authService.getCurrentUser()).thenReturn(user);

        boolean result = toolsService.deleteTool("id-invalido");
        assertFalse(result);
    }
    @Test
    void getToolRanking_devuelveListaDeDTOsCorrecta() {
        // Arrange: Simula el resultado de la consulta nativa
        List<Object[]> mockResults = new ArrayList<>();
        mockResults.add(new Object[]{
                "id1", "Martillo", "Manuales",
                5L, 2L, 1000.0, 100.0
        });
        mockResults.add(new Object[]{
                "id2", "Sierra", "Eléctricas",
                null, null, null, null
        });

        when(toolsRepository.findToolRankingNative()).thenReturn(mockResults);

        // Act: Llama al método
        List<ToolRankingDTO> ranking = toolsService.getToolRanking();

        // Assert: Verifica que los resultados sean correctos
        assertEquals(2, ranking.size());
        ToolRankingDTO tool1 = ranking.get(0);
        assertEquals("id1", tool1.getId());
        assertEquals("Martillo", tool1.getName());
        assertEquals("Manuales", tool1.getCategory());
        assertEquals(5L, tool1.getTotalLoans());
        assertEquals(2L, tool1.getActiveLoans());
        assertEquals(1000.0, tool1.getTotalRevenue());
        assertEquals(0.0, tool1.getTotalFines());

        ToolRankingDTO tool2 = ranking.get(1);
        assertEquals("id2", tool2.getId());
        assertEquals("Sierra", tool2.getName());
        assertEquals("Eléctricas", tool2.getCategory());
        assertEquals(0L, tool2.getTotalLoans());
        assertEquals(0L, tool2.getActiveLoans());
        assertEquals(0.0, tool2.getTotalRevenue());
        assertEquals(0.0, tool2.getTotalFines());
    }

    @Test
    void createTool_lanzaExcepcionSiYaExisteMismoNombre() {
        // Llenamos los datos para que pase la validación de "campos obligatorios"
        Tools toolRepetida = new Tools();
        toolRepetida.setName("Martillo");
        toolRepetida.setCategory("Manuales");
        toolRepetida.setReplacementValue(BigDecimal.valueOf(10000));

        // Mockeamos que el nombre YA existe
        when(toolsRepository.existsByNameIgnoreCase("Martillo")).thenReturn(true);
        //Se guarda excepcion en variable ex, para luego ser verificada mas abajo
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> toolsService.createTool(toolRepetida)
        );
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Ya existe"));
    }





































}