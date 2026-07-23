package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByRole(Employee.EmployeeRole role);
    List<Employee> findByRoleIn(List<Employee.EmployeeRole> roles);
    Optional<Employee> findByEmail(String email);
}
