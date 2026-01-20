package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.ToolRankingDTO;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.ToolsRepository;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;
import com.backend_tingeso.demo.entity.enums.MovementType;

/**
 * Esta clase contiene la lógica real. Implementa la interfaz y usa el ToolsRepository para interactuar con la base de datos.
 *
 *
 */


@Service
public class ToolsServiceImpl implements ToolsService {

    private final ToolsRepository toolsRepository;
    private final KardexService kardexService;
    private final AuthService authService;
    private static final Logger log = LoggerFactory.getLogger(ToolsServiceImpl.class);
    // Spring automáticamente nos "pasa" una instancia de ToolRepository
    public  ToolsServiceImpl(ToolsRepository toolRepository, KardexService kardexService, AuthService authService) {
        this.toolsRepository = toolRepository;
        this.kardexService = kardexService;
        this.authService = authService;
    }
    //Se valida si estado de herramienta cumple con estados validos, segun reglas de negocio
    private static final Set<String> ESTADOS_VALIDOS = Set.of("Disponible", "Prestada", "En reparación", "Dada de baja");

    private void validarEstado(String estado) {
        if (estado == null || !ESTADOS_VALIDOS.contains(estado)) {
            throw new IllegalArgumentException("Estado inválido. Debe ser uno de: " + ESTADOS_VALIDOS);
        }
    }

//Crea herramienta, siguiendo reglas de negocio
    @Override
    @Transactional
    public Tools createTool(Tools tool) {
        // 1. Limpieza de datos
        if (tool.getName() != null) {
            tool.setName(tool.getName().trim()); // Quita espacios al inicio y final
        }
        if (tool.getId() == null) {
            String id = UUID.randomUUID().toString();
            tool.setId(id);
            // asignar UUID antes de guardar
        }
        if (tool.getName() == null || tool.getName().isBlank() ||
                tool.getCategory() == null || tool.getCategory().isBlank() ||
                tool.getReplacementValue() == null) {
            throw new IllegalArgumentException("Nombre, categoría y valor de reposición son obligatorios");
        }
        // 3. Validación lógica previa
        // 1. PRIMERA CAPA: Validación manual (Debe funcionar el 99% de las veces)
        if (toolsRepository.existsByNameIgnoreCase(tool.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe: " + tool.getName());
        }

        validarEstado(tool.getStatus());

        // 2. SEGUNDA CAPA: El guardado forzado
        Tools savedTool = toolsRepository.saveAndFlush(tool);
        // Obtener usuario actual
        Users currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            throw new IllegalStateException("No se pudo obtener el usuario autenticado");
        }

        log.info("Usuario obtenido: ID={}, username={}", currentUser.getId(), currentUser.getUsername()); // ✅ Debug

        // Generar movimiento en el kardex
        kardexService.createKardex(savedTool, currentUser, null, MovementType.ENTRADA, 1, "");

        return savedTool;
    }

    @Override
    public List<Tools> getAllTools() {
        // findAll() devuelve todos los registros de la tabla tools
        return toolsRepository.findAll();
    }
    //borrar herramienta segun regla de negocio
    @Override
    public boolean deleteTool(String id) {
        Users currentUser = authService.getCurrentUser(); // Usamos el método anterior

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            throw new SecurityException("Solo los administradores pueden dar de baja herramientas");
        }

        try {
            // validar que el id tenga formato UUID
            UUID.fromString(id);
            if (toolsRepository.existsById(id)) {
                toolsRepository.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    public List<ToolRankingDTO> getToolRanking() {
        // Ejecuta la consulta nativa y obtiene el resultado en bruto
        List<Object[]> results = toolsRepository.findToolRankingNative();

        // Lista que contendrá los DTOs convertidos
        List<ToolRankingDTO> ranking = new ArrayList<>();

        // Itera cada fila del resultado
        for (Object[] row : results) {
            // Construye el DTO con cada campo convertido en su tipo correspondiente
            ranking.add(new ToolRankingDTO(
                    (String) row[0], // id
                    (String) row[1], // name
                    (String) row[2], // category

                    // totalLoans (long), default 0 si es null
                    row[3] != null ? ((Number) row[3]).longValue() : 0L,

                    // activeLoans (long), default 0 si es null
                    row[4] != null ? ((Number) row[4]).longValue() : 0L,

                    // totalRevenue (double), default 0.0 si es null
                    row[5] != null ? ((Number) row[5]).doubleValue() : 0.0,

                    // totalFines (double), default 0.0 si es null
                    row[6] != null ? ((Number) row[6]).doubleValue() : 0.0
            ));
        }

        // Devuelve la lista ya transformada a DTOs
        return ranking;
    }

    @Override
    public Tools updateToolStatus(String id, String newStatus) {
        Tools tool = toolsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Herramienta no encontrada"));
        tool.setStatus(newStatus); // Cambia de "ACTIVE" a "dada de baja"
        return toolsRepository.save(tool);
    }

}
