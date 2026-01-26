package com.backend_tingeso.demo.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDuplicate(
            DataIntegrityViolationException ex) {

        // Protección contra null
        String message = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : "";

        if (message.contains("tools.name")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Ya existe una herramienta con ese nombre");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Error de integridad de datos");
    }
}

