package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.dto.ToolRankingDTO;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.service.ToolsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// La URL base para todos los endpoints de tools
@RequestMapping("/api/v1/tools")
public class ToolsController {

    // CORRECCIÓN: Usar SLF4J Logger en lugar de JUnit Logger
    private static final Logger log = LoggerFactory.getLogger(ToolsController.class);
    private final ToolsService toolsService;

    // Inyectamos la INTERFAZ, no la implementación.
    // El controlador no sabe que existe "ToolsServiceImpl", solo conoce el "contrato".
    public ToolsController(ToolsService toolsService) {
        this.toolsService = toolsService;
    }

    // Endpoint para crear un nuevo Tool
    @PostMapping
    public ResponseEntity<Tools> createTool(@RequestBody Tools tool) {

        log.info("=== CONTROLLER REACHED ===");
        log.info("Received tool: {}", tool);

        Tools newTool = toolsService.createTool(tool);

        log.info("Tool created successfully");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newTool);
    }

    // Endpoint para obtener todos los Tools
    @GetMapping
    public List<Tools> getAllTools() {
        log.debug("Getting all tools");
        return toolsService.getAllTools();
    }

    // Endpoint para eliminar un Tool por su ID (UUID en String)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTool(@PathVariable String id) {
        log.info("Attempting to delete tool with id: {}", id);

        boolean deleted = toolsService.deleteTool(id);
        if (deleted) {
            log.info("Tool with id {} deleted successfully", id);
            return ResponseEntity.ok("Tool eliminado correctamente");
        } else {
            log.warn("Tool with id {} not found or invalid ID", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tool no encontrado o ID inválido");
        }
    }
    // Endpoint para obtener el ranking de herramientas
    @GetMapping("/ranking")
    public List<ToolRankingDTO> getToolRanking() {
        return toolsService.getToolRanking();
    }

    //Endpoint para actualizar estado de herramienta
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateToolStatus(@PathVariable String id, @RequestParam String newStatus) {
        try {
            Tools updatedTool = toolsService.updateToolStatus(id, newStatus);
            return ResponseEntity.ok(updatedTool);
        } catch (IllegalArgumentException e) {
            log.error("Error updating tool status: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
}
    }
}
