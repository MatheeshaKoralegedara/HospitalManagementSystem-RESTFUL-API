package com.hospital.management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "staff")
public class Staff extends User {
    private String role; // Nurse, Receptionist, Pharmacist, etc.
    private String department;
    private double salary;

    // Getters and setters
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }
}
