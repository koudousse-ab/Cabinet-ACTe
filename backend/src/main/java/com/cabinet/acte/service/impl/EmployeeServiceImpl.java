package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.EmployeeDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.entity.ErrorLog;
import com.cabinet.acte.repository.EmployeeRepository;
import com.cabinet.acte.repository.ErrorLogRepository;
import com.cabinet.acte.service.EmployeeService;
import com.cabinet.acte.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ErrorLogRepository errorLogRepository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        Employee employee = employeeDTO.toEntity();
        if (employeeDTO.getPassword() != null && !employeeDTO.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        }
        Employee saved = employeeRepository.save(employee);
        return EmployeeDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        return employeeRepository.findById(id)
            .map(EmployeeDTO::fromEntity)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setName(employeeDTO.getName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setRole(employeeDTO.getRole());

        if (employeeDTO.getPassword() != null && !employeeDTO.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        }

        Employee updated = employeeRepository.save(employee);
        return EmployeeDTO.fromEntity(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
            .map(EmployeeDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getEmployeeTasks(Long id) {
        return taskService.getTasksByAssignedTo(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ErrorLogDTO> getEmployeeErrors(Long id) {
        return errorLogRepository.findByEmployeeId(id).stream()
            .map(ErrorLogDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public ErrorLogDTO addError(ErrorLogDTO errorLogDTO) {
        ErrorLog errorLog = errorLogDTO.toEntity();
        ErrorLog saved = errorLogRepository.save(errorLog);
        return ErrorLogDTO.fromEntity(saved);
    }
}
