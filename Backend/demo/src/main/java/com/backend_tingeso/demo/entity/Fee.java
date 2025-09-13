package com.backend_tingeso.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fee")
public class Fee {
    @Id
    private String id;
    private String type;
    private Integer value;
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false) // Cambiar según el nombre real de tu columna
    private LocalDateTime createdAt;
    private String updated_by;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getUpdated_by() {
        return updated_by;
    }
    public void setUpdated_by(String updated_by) {
        this.updated_by = updated_by;
    }
}
