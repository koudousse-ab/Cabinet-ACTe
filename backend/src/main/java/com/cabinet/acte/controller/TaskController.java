package com.cabinet.acte.controller;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Task;
import com.cabinet.acte.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * Create a new task
     * POST /api/v1/tasks
     */
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTask = taskService.createTask(taskDTO);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * Get task by ID
     * GET /api/v1/tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    /**
     * Get all tasks
     * GET /api/v1/tasks
     */
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<TaskDTO> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * Update task
     * PUT /api/v1/tasks/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Delete task
     * DELETE /api/v1/tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get tasks by project ID
     * GET /api/v1/tasks/project/{projectId}
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable Long projectId) {
        List<TaskDTO> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get tasks assigned to employee
     * GET /api/v1/tasks/assigned/{employeeId}
     */
    @GetMapping("/assigned/{employeeId}")
    public ResponseEntity<List<TaskDTO>> getTasksByAssignedTo(@PathVariable Long employeeId) {
        List<TaskDTO> tasks = taskService.getTasksByAssignedTo(employeeId);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get tasks by status
     * GET /api/v1/tasks/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@PathVariable String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        List<TaskDTO> tasks = taskService.getTasksByStatus(taskStatus);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get tasks by priority
     * GET /api/v1/tasks/priority/{priority}
     */
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TaskDTO>> getTasksByPriority(@PathVariable String priority) {
        Task.TaskPriority taskPriority = Task.TaskPriority.valueOf(priority.toUpperCase());
        List<TaskDTO> tasks = taskService.getTasksByPriority(taskPriority);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get tasks by project and status
     * GET /api/v1/tasks/project/{projectId}/status/{status}
     */
    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectAndStatus(
        @PathVariable Long projectId,
        @PathVariable String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        List<TaskDTO> tasks = taskService.getTasksByProjectAndStatus(projectId, taskStatus);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get overdue tasks
     * GET /api/v1/tasks/overdue
     */
    @GetMapping("/overdue")
    public ResponseEntity<List<TaskDTO>> getOverdueTasks() {
        List<TaskDTO> tasks = taskService.getOverdueTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get upcoming tasks
     * GET /api/v1/tasks/upcoming?startDate=2024-01-01&endDate=2024-01-31
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskDTO>> getUpcomingTasks(
        @RequestParam LocalDate startDate,
        @RequestParam LocalDate endDate) {
        List<TaskDTO> tasks = taskService.getUpcomingTasks(startDate, endDate);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Update task status
     * PATCH /api/v1/tasks/{id}/status/{status}
     */
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<TaskDTO> updateTaskStatus(
        @PathVariable Long id,
        @PathVariable String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        TaskDTO updatedTask = taskService.updateTaskStatus(id, taskStatus);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Get task count by status
     * GET /api/v1/tasks/count/project/{projectId}/status/{status}
     */
    @GetMapping("/count/project/{projectId}/status/{status}")
    public ResponseEntity<Long> getTaskCountByStatus(
        @PathVariable Long projectId,
        @PathVariable String status) {
        Task.TaskStatus taskStatus = Task.TaskStatus.valueOf(status.toUpperCase());
        Long count = taskService.getTaskCountByStatus(projectId, taskStatus);
        return ResponseEntity.ok(count);
    }
}
