package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.dto.ToolDTO;
import com.backend_tingeso.demo.dto.ToolRankingDTO;
import com.backend_tingeso.demo.entity.Tools;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Se define que se puede hacer, pero no como
 *
 *
 */

public interface ToolsService {
    // Crear una nueva herramienta
    Tools createTool(Tools tool);
    // Obtener todas las herramientas
    List<Tools> getAllTools();
    // Eliminar herramienta por ID
    boolean deleteTool(String id);
    // Obtener ranking de herramientas
    List<ToolRankingDTO> getToolRanking();
    //Actualizar estado de  herramienta
    Tools updateToolStatus(String id, String newStatus);
    //Actualizar herramienta
    Tools updateTool(String id, ToolDTO request);
}
