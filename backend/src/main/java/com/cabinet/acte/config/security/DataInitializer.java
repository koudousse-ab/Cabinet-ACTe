package com.cabinet.acte.config.security;

import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.findByEmail("admin@cabinet-acte.com").isEmpty()) {
            Employee admin = new Employee();
            admin.setName("Administrateur");
            admin.setEmail("admin@cabinet-acte.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Employee.EmployeeRole.ADMIN);
            employeeRepository.save(admin);
            System.out.println("✅ Compte admin créé : admin@cabinet-acte.com / admin123");
        }
    }
}
