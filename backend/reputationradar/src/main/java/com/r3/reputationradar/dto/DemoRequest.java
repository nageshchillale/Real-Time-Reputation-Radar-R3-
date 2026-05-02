package com.r3.reputationradar.dto;

public class DemoRequest {
    private String name;
    private String email;
    private String company;

    public DemoRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}
