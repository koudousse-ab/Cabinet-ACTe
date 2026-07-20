package com.cabinet.acte.service;

import com.cabinet.acte.dto.EmployeeDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;

import java.util.List;

public interface EmployeeService {

    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);

    EmployeeDTO getEmployeeById(Long id);

    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);

    void deleteEmployee(Long id);

    List<EmployeeDTO> getAllEmployees();

    List<TaskDTO> getEmployeeTasks(Long id);

    List<ErrorLogDTO> getEmployeeErrors(Long id);

    ErrorLogDTO addError(ErrorLogDTO errorLogDTO);
}
