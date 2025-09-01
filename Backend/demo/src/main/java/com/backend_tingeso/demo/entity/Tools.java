package com.backend_tingeso.demo.entity;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tools")

public class Tools {
    @Id
    private String id;
    private String name;
    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "status", columnDefinition = "TINYTEXT")
    private String status;

    @Column(name = "replacement_value", precision = 10, scale = 2)
    private BigDecimal replacementValue;

    @Column(name = "rental_price", precision = 10, scale = 2)
    private BigDecimal rentalPrice;

    @Column(name = "stock")
    private Integer stock;
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false) // Cambiar según el nombre real de tu columna
    private LocalDateTime createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getReplacementValue() {
        return replacementValue;
    }

    public void setReplacementValue(BigDecimal replacementValue) {
        this.replacementValue = replacementValue;
    }

    public BigDecimal getRentalPrice() {
        return rentalPrice;
    }

    public void setRentalPrice(BigDecimal rentalPrice) {
        this.rentalPrice = rentalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
