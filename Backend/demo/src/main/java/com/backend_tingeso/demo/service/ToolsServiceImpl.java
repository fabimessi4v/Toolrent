package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.entity.Users;
import com.backend_tingeso.demo.repository.ToolsRepository;
import com.backend_tingeso.demo.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;

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
    public Tools createTool(Tools tool) {
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
        validarEstado(tool.getStatus());
        // el nuevo registro de una herramienta, genera movimiento en el kardex
        Tools savedTool = toolsRepository.save(tool);
        kardexService.createKardex(savedTool, authService.getCurrentUser(), "Registro nuevo");
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
            UUID uuid = UUID.fromString(id);
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
}
