package com.backend_tingeso.demo.dto;

import java.time.LocalDate;

public class KardexDTO {
    private String id;
    private String toolName;
    private String userName;
    private String type; // Se convierte de MovementType a String para el front
    private Integer quantity;
    private LocalDate movementDate;
    private String comments;

    public KardexDTO(String id, String toolName, String userName, String type, Integer quantity, LocalDate movementDate, String comments) {
        this.id = id;
        this.toolName = toolName;
        this. userName = userName;
        this. type = type;
        this. quantity = quantity;
        this. movementDate = movementDate;
        this.comments = comments;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToolName() {
        return toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public LocalDate getMovementDate() {
        return movementDate;
    }

    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}