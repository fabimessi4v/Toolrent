package com.backend_tingeso.demo.dto;

public class ToolRankingDTO {
    private String id;
    private String name;
    private String category;
    private long totalLoans;
    private long activeLoans;
    private double totalRevenue;
    private double totalFines;

    public ToolRankingDTO(String id, String name, String category, long totalLoans, long activeLoans, double totalRevenue, double totalFines) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.totalLoans = totalLoans;
        this.activeLoans = activeLoans;
        this.totalRevenue = totalRevenue;
    }

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

    public long getTotalLoans() {
        return totalLoans;
    }

    public void setTotalLoans(long totalLoans) {
        this.totalLoans = totalLoans;
    }

    public long getActiveLoans() {
        return activeLoans;
    }

    public void setActiveLoans(long activeLoans) {
        this.activeLoans = activeLoans;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getTotalFines() {
        return totalFines;
    }

    public void setTotalFines(double totalFines) {
        this.totalFines = totalFines;
    }
}
