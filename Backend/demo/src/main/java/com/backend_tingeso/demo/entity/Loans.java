package com.backend_tingeso.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "loans")
public class Loans {
    @Id
    private String id;
    // Relación ManyToOne: Un usuario tiene muchos prestamos
    @JsonIgnoreProperties
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @NotFound(action = NotFoundAction.IGNORE)
    @JoinColumn(name = "client_id", nullable = false)
    private Users client;
    // Relación ManyToOne: Una herramienta puede estar en muchos prestamos
    @JsonIgnoreProperties
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tool_id", nullable = false)
    private Tools tool;
    // Relación ManyToOne: Un cliente tiene muchos prestamos
    @JsonIgnoreProperties
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "customers_id", nullable = false)
    private Customer customer;
    @Column(name = "delivery_date")
    private Date deliveryDate;
    @Column(name = "due_date")
    private Date dueDate;
    @Column(name = "return_date")
    private Date returnDate;
    @Column(name = "status")
    private String status;
    @Column(name = "fine")
    private Float fine;
    @Column(name = "createdAt", updatable = false)
    private java.sql.Timestamp createdAt; // No uses LocalDateTime para columna TIMESTAMP si tienes problemas

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public Users getClient() {
        return client;
    }

    public void setClient(Users client) {
        this.client = client;
    }

    public Tools getTool() {
        return tool;
    }

    public void setTool(Tools tool) {
        this.tool = tool;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Date getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Date deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Float getFine() {
        return fine;
    }

    public void setFine(Float fine) {
        this.fine = fine;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
