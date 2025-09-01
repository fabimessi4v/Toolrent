package com.backend_tingeso.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fee")
public class Fee {
    @Id
    private UUID id;
    // Relación ManyToOne: Un usuario tiene muchos cargos
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customers_id", nullable = false)
    private Customer client;
    // Relación ManyToOne: Un prestamo puede tener muchos cargos
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loans_id", nullable = false)
    private Loans loans;
    private String type;
    private Integer value;
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false) // Cambiar según el nombre real de tu columna
    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Customer getClient() {
        return client;
    }

    public void setClient(Customer client) {
        this.client = client;
    }

    public Loans getLoans() {
        return loans;
    }

    public void setLoans(Loans loans) {
        this.loans = loans;
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
}
