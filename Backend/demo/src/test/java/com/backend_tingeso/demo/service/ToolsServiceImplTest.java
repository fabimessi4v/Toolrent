package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.dto.ToolRankingDTO;
import com.backend_tingeso.demo.repository.ToolsRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

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
        when(toolsRepository.save(any(Tools.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Tools result = toolsService.createTool(tool);

        // Assert
        assertNotNull(result.getId());
        verify(kardexService).createKardex(any(Tools.class), eq(user), isNull(), eq("Registro nuevo"), eq(1), eq(""));
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
    
}