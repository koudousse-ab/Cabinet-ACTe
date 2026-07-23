package com.cabinet.acte.controller;

import com.cabinet.acte.dto.EmployeeDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.repository.EmployeeRepository;
import com.cabinet.acte.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        EmployeeDTO created = employeeService.createEmployee(employeeDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskDTO>> getEmployeeTasks(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeTasks(id));
    }

    @GetMapping("/{id}/errors")
    public ResponseEntity<List<ErrorLogDTO>> getEmployeeErrors(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeErrors(id));
    }

    @PostMapping("/errors")
    public ResponseEntity<ErrorLogDTO> addError(@Valid @RequestBody ErrorLogDTO errorLogDTO) {
        return new ResponseEntity<>(employeeService.addError(errorLogDTO), HttpStatus.CREATED);
    }

    // ═══════ NOUVEAU ENDPOINT : Récupérer l'utilisateur connecté ═══════
    @GetMapping("/me")
    public ResponseEntity<EmployeeDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        return ResponseEntity.ok(EmployeeDTO.fromEntity(employee));
    }
}
