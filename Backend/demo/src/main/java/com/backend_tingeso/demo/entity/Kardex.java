package com.backend_tingeso.demo.entity;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "kardex")
public class Kardex {
    @Id
    private UUID id;
    // Relación ManyToOne: Una herramienta puede tener muchos movimientos (kardex)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tool_id", nullable = false)
    private Tools tool;
    // Relación ManyToOne: Un usuario registrar muchos movimientos en el kardex
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;
    // Relación ManyToOne: Un prestamo puede generar varios movimientos en el kardex
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "loans_id", nullable = false)
    private Loans loans;
    private String type;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "movement_date")
    private Date movementDate;
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false) // Cambiar según el nombre real de tu columna
    private LocalDateTime createdAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Tools getTool() {
        return tool;
    }

    public void setTool(Tools tool) {
        this.tool = tool;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Date getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(Date movementDate) {
        this.movementDate = movementDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
