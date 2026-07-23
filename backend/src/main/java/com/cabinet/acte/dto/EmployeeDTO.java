package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Employee;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class EmployeeDTO {
    private Long id;
    private String name;
    private String email;
    private Employee.EmployeeRole role;
    private LocalDateTime createdAt;
    private String password;

    public EmployeeDTO() {}
    public EmployeeDTO(Long id, String name, String email, Employee.EmployeeRole role, LocalDateTime createdAt, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.password = password;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Employee.EmployeeRole getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPassword() { return password; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Employee.EmployeeRole role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setPassword(String password) { this.password = password; }

    public static EmployeeDTO fromEntity(Employee employee) {
        return new EmployeeDTO(
            employee.getId(),
            employee.getName(),
            employee.getEmail(),
            employee.getRole(),
            employee.getCreatedAt(),
            null
        );
    }

    public Employee toEntity() {
        Employee employee = new Employee();
        employee.setId(this.id);
        employee.setName(this.name);
        employee.setEmail(this.email);
        employee.setRole(this.role);
        employee.setPassword(this.password);
        return employee;
    }
}
