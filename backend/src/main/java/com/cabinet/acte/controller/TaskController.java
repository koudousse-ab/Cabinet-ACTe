package com.cabinet.acte.controller;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.entity.Task;
import com.cabinet.acte.repository.EmployeeRepository;
import com.cabinet.acte.service.NotificationService;
import com.cabinet.acte.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO createdTask = taskService.createTask(taskDTO);
        if (taskDTO.getAssignedTo() != null) {
            notificationService.createNotification(
                "Une nouvelle tâche vous a été assignée : " + createdTask.getTitle(),
                taskDTO.getAssignedTo(),
                createdTask.getId()
            );
        }
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String email = authentication.getName();

        if (role.equals("ROLE_EMPLOYE")) {
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
            return ResponseEntity.ok(taskService.getTasksByAssignedTo(employee.getId()));
        }
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO);
        if (taskDTO.getAssignedTo() != null) {
            notificationService.createNotification(
                "La tâche '" + updatedTask.getTitle() + "' vous a été réassignée",
                taskDTO.getAssignedTo(),
                updatedTask.getId()
            );
        }
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }

    @GetMapping("/assigned/{employeeId}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssignedTo(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.getTasksByAssignedTo(employeeId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@PathVariable String status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(Task.TaskStatus.valueOf(status.toUpperCase())));
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TaskDTO>> getTasksByPriority(@PathVariable String priority) {
        return ResponseEntity.ok(taskService.getTasksByPriority(Task.TaskPriority.valueOf(priority.toUpperCase())));
    }

    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectAndStatus(
            @PathVariable Long projectId, @PathVariable String status) {
        return ResponseEntity.ok(taskService.getTasksByProjectAndStatus(
                projectId, Task.TaskStatus.valueOf(status.toUpperCase())));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<TaskDTO>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.getOverdueTasks());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskDTO>> getUpcomingTasks(
            @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(taskService.getUpcomingTasks(startDate, endDate));
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long id, @PathVariable String status, Authentication authentication) {
        TaskDTO updatedTask = taskService.updateTaskStatus(id, Task.TaskStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping("/count/project/{projectId}/status/{status}")
    public ResponseEntity<Long> getTaskCountByStatus(
            @PathVariable Long projectId, @PathVariable String status) {
        return ResponseEntity.ok(taskService.getTaskCountByStatus(
                projectId, Task.TaskStatus.valueOf(status.toUpperCase())));
    }

    @GetMapping("/week")
    public ResponseEntity<List<TaskDTO>> getTasksForWeek(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) Long employeeId,
            Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String email = authentication.getName();

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        List<TaskDTO> tasks;

        if (employeeId != null) {
            if (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_CHEF_PROJET")) {
                throw new RuntimeException("Non autorisé à voir les tâches d'un autre employé");
            }
            tasks = taskService.getTasksByAssignedTo(employeeId);
        } else if (role.equals("ROLE_EMPLOYE")) {
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
            tasks = taskService.getTasksByAssignedTo(employee.getId());
        } else {
            tasks = taskService.getAllTasks();
        }

        final LocalDate startFinal = start;
        final LocalDate endFinal = end;
        return ResponseEntity.ok(
            tasks.stream()
                .filter(t -> t.getDueDate() != null)
                .filter(t -> !t.getDueDate().isBefore(startFinal) && !t.getDueDate().isAfter(endFinal))
                .toList()
        );
    }

    @GetMapping("/notifications")
    public ResponseEntity<Long> getNotificationCount(Authentication authentication) {
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        String email = authentication.getName();

        if (role.equals("ROLE_EMPLOYE")) {
            Employee employee = employeeRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
            return ResponseEntity.ok(taskService.countByAssignedToAndStatusIn(
                    employee.getId(),
                    List.of(Task.TaskStatus.TODO, Task.TaskStatus.IN_PROGRESS)
            ));
        }
        return ResponseEntity.ok(0L);
    }
}
