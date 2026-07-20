package com.cabinet.acte.service;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Task;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {

    /**
     * Create a new task
     */
    TaskDTO createTask(TaskDTO taskDTO);

    /**
     * Get task by ID
     */
    TaskDTO getTaskById(Long id);

    /**
     * Update an existing task
     */
    TaskDTO updateTask(Long id, TaskDTO taskDTO);

    /**
     * Delete a task
     */
    void deleteTask(Long id);

    /**
     * Get all tasks
     */
    List<TaskDTO> getAllTasks();

    /**
     * Get tasks by project ID
     */
    List<TaskDTO> getTasksByProjectId(Long projectId);

    /**
     * Get tasks assigned to an employee
     */
    List<TaskDTO> getTasksByAssignedTo(Long employeeId);

    /**
     * Get tasks by status
     */
    List<TaskDTO> getTasksByStatus(Task.TaskStatus status);

    /**
     * Get tasks by priority
     */
    List<TaskDTO> getTasksByPriority(Task.TaskPriority priority);

    /**
     * Get tasks by project and status
     */
    List<TaskDTO> getTasksByProjectAndStatus(Long projectId, Task.TaskStatus status);

    /**
     * Get overdue tasks
     */
    List<TaskDTO> getOverdueTasks();

    /**
     * Get upcoming tasks
     */
    List<TaskDTO> getUpcomingTasks(LocalDate startDate, LocalDate endDate);

    /**
     * Update task status
     */
    TaskDTO updateTaskStatus(Long id, Task.TaskStatus status);

    /**
     * Get task count by status for a project
     */
    Long getTaskCountByStatus(Long projectId, Task.TaskStatus status);
}
