package com.backend_tingeso.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "tools")
public class Tool {
    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Lob
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "replacement_value", nullable = false)
    private Float replacementValue;

    @Column(name = "rental_price", nullable = false)
    private Float rentalPrice;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "createdAt")
    private Instant createdAt;

    @OneToMany(mappedBy = "tool")
    private Set<Kardex> kardexes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "tool")
    private Set<Loan> loans = new LinkedHashSet<>();

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

    public Float getReplacementValue() {
        return replacementValue;
    }

    public void setReplacementValue(Float replacementValue) {
        this.replacementValue = replacementValue;
    }

    public Float getRentalPrice() {
        return rentalPrice;
    }

    public void setRentalPrice(Float rentalPrice) {
        this.rentalPrice = rentalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Kardex> getKardexes() {
        return kardexes;
    }

    public void setKardexes(Set<Kardex> kardexes) {
        this.kardexes = kardexes;
    }

    public Set<Loan> getLoans() {
        return loans;
    }

    public void setLoans(Set<Loan> loans) {
        this.loans = loans;
    }

}