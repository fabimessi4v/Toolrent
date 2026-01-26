package com.backend_tingeso.demo.entity;


import com.backend_tingeso.demo.entity.enums.MovementType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "kardex")
public class Kardex {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // 1. FECHA DEL MOVIMIENTO
    @Column(name = "movement_date", nullable = false)
    private LocalDate movementDate;

    // 2. TIPO ej: INGRESO, EGRESO, AJUSTE, BAJA, COMPRA
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private MovementType type;

    // 3. HERRAMIENTA
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tool_id", nullable = false)
    private Tools tool;

    // 4. CANTIDAD
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // 5. DESCRIPCIÓN
    @Column(name = "comments") // En BD suele llamarse comments o description
    private String comments;

    // 6. USUARIO
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // ---  campos que no se usan en front---
    // Esto es correcto para movimientos como: "Compra de inventario", "Baja por daño", "Ajuste".
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = true)
    private Loans loan;

    // Auditoría automática (cuándo se insertó el registro real en BD)
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Getters y Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public MovementType getType() {
        return type;
    }

    public void setType(MovementType type) {
        this.type = type;
    }

    public Tools getTool() {
        return tool;
    }

    public void setTool(Tools tool) {
        this.tool = tool;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public Loans getLoan() {
        return loan;
    }

    public void setLoan(Loans loan) {
        this.loan = loan;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
