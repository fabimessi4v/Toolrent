package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.entity.Customer;
import com.backend_tingeso.demo.entity.Tools;
import com.backend_tingeso.demo.service.CustomerService;
import com.backend_tingeso.demo.service.ToolsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
// La URL base para todos los endpoints de clientes
@RequestMapping("/api/v1/tools")
public class ToolsController {

    private final ToolsService toolsService;

    // Inyectamos la INTERFAZ, no la implementación.
    // El controlador no sabe que existe "ToolsServiceImpl", solo conoce el "contrato".
    public ToolsController(ToolsService toolsService) {
        this.toolsService = toolsService;
    }

    // Endpoint para crear un nuevo Tool
    @PostMapping
    public ResponseEntity<Tools> createTool(@RequestBody Tools tool) {
        Tools newTool = toolsService.createTool(tool);
        return new ResponseEntity<>(newTool, HttpStatus.CREATED);
    }
    // Endpoint para obtener todos los Tools
    @GetMapping
    public List<Tools> getAllTools() {
        return toolsService.getAllTools();
    }

    // Endpoint para eliminar un Tool por su ID (UUID en String)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTool(@PathVariable String id) {
        boolean deleted = toolsService.deleteTool(id);
        if (deleted) {
            return ResponseEntity.ok("Tool eliminado correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Tool no encontrado o ID inválido");
        }
    }

}
