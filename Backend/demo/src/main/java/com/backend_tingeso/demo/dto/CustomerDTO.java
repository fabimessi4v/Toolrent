package com.backend_tingeso.demo.dto;

public class CustomerDTO {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String status;
    private int totalLoans;
    private int activeLoans;
    private float unpaidFines;

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalLoans() { return totalLoans; }
    public void setTotalLoans(int totalLoans) { this.totalLoans = totalLoans; }

    public int getActiveLoans() { return activeLoans; }
    public void setActiveLoans(int activeLoans) { this.activeLoans = activeLoans; }

    public float getUnpaidFines() { return unpaidFines; }
    public void setUnpaidFines(float unpaidFines) { this.unpaidFines = unpaidFines; }

}