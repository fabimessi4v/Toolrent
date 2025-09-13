package com.backend_tingeso.demo.controller;

import com.backend_tingeso.demo.service.FeeService;
import com.backend_tingeso.demo.service.FeeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/fee")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @PutMapping("/{type}")
    public ResponseEntity<?> upsert(
            @PathVariable String type,
            @RequestBody ValueRequest body
    ) {
        try {
            FeeServiceImpl.FeeDto existing = null;
            try {
                existing = feeService.getByType(type);
            } catch (Exception ignored) { }

            FeeServiceImpl.FeeDto fee = feeService.upsert(type, body.getValue());
            boolean existed = existing != null;

            return ResponseEntity
                    .status(existed ? HttpStatus.OK : HttpStatus.CREATED)
                    .body(fee);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno");
        }
    }

    @GetMapping("/{type}")
    public ResponseEntity<?> getByType(@PathVariable String type) {
        try {
            return ResponseEntity.ok(feeService.getByType(type));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Error interno");
        }
    }

    public static class ValueRequest {
        private Integer value;
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
    }
}