package com.backend_tingeso.demo.service;


import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.repository.ToolsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Esta clase contiene la lógica real. Implementa la interfaz y usa el ToolsRepository para interactuar con la base de datos.
 *
 *
 */


@Service
public class ToolsServiceImpl implements ToolsService {
    private final ToolsRepository toolsRepository;

    // Spring automáticamente nos "pasa" una instancia de ToolRepository
    public  ToolsServiceImpl(ToolsRepository toolRepository) {
        this.toolsRepository = toolRepository;
    }

    @Override
    public Tools createTool(Tools tool) {
        // save() inserta si no existe o actualiza si ya existe
        return toolsRepository.save(tool);
    }

    @Override
    public List<Tools> getAllTools() {
        // findAll() devuelve todos los registros de la tabla tools
        return toolsRepository.findAll();
    }

    @Override
    public boolean deleteTool(String id) {
        try {
            // Convertimos el String a UUID
            UUID uuid = UUID.fromString(id);

            // Verificamos si existe el Tool
            if (toolsRepository.existsById(uuid)) {
                // Si existe, lo eliminamos
                toolsRepository.deleteById(uuid);
                return true; // Eliminación exitosa
            } else {
                return false; // No se encontró el Tool
            }
        } catch (IllegalArgumentException e) {
            // Si el String no es un UUID válido, atrapamos la excepción
            return false;
        }
    }
}
