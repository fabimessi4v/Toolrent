package com.backend_tingeso.demo.dto;

import jakarta.persistence.Column;

import java.math.BigDecimal;

public class ToolDTO {
    private String name;
    private String category;
    private int stock;
    private String status;
    private BigDecimal replacementValue;
    private BigDecimal rentalPrice;
    private String tool_imageUrl;

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

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
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

    public String getTool_imageUrl() {
        return tool_imageUrl;
    }

    public void setTool_imageUrl(String tool_imageUrl) {
        this.tool_imageUrl = tool_imageUrl;
    }
}
