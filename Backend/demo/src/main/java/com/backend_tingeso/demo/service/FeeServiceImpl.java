package com.backend_tingeso.demo.service;

import com.backend_tingeso.demo.entity.Fee;
import com.backend_tingeso.demo.repository.FeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
public class FeeServiceImpl implements FeeService {

    private final FeeRepository feeRepository;

    // Tipos permitidos (amplía si agregas otros)
    private static final Set<String> ALLOWED_TYPES = Set.of("LATE_FEE");

    public FeeServiceImpl(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    // DTO de respuesta
    public static class FeeDto {
        private String id;
        private String type;
        private Integer value;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    // DTO request si lo necesitas en algún otro lugar (aquí no lo usas directamente)
    public static class FeeCreateDTO {
        private String type;
        private Integer value;
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
    }

    private void validateType(String type) {
        if (type == null || type.isBlank() || !ALLOWED_TYPES.contains(type)) {
            throw new IllegalArgumentException("Tipo no permitido: " + type);
        }
    }

    private void validateValue(Integer value) {
        if (value == null) {
            throw new IllegalArgumentException("Valor requerido");
        }
        if (value < 0) {
            throw new IllegalArgumentException("El valor no puede ser negativo");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FeeDto getByType(String type) {
        validateType(type);
        Fee fee = feeRepository.findByType(type)
                .orElseThrow(() -> new IllegalArgumentException("No existe tarifa para type=" + type));
        return map(fee);
    }

    @Override
    @Transactional
    public FeeDto upsert(String type, Integer value) {
        validateType(type);
        validateValue(value);

        Fee fee = feeRepository.findByType(type).orElse(null);
        if (fee == null) {
            fee = new Fee();
            fee.setId(UUID.randomUUID().toString());
            fee.setType(type);
        }
        fee.setValue(value);
        Fee saved = feeRepository.save(fee);
        return map(saved);
    }

    private FeeDto map(Fee fee) {
        FeeDto dto = new FeeDto();
        dto.setId(fee.getId());
        dto.setType(fee.getType());
        dto.setValue(fee.getValue());
        dto.setCreatedAt(fee.getCreatedAt());
        return dto;
    }
}