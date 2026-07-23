package com.cabinet.acte.service;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Task;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    TaskDTO createTask(TaskDTO taskDTO);
    TaskDTO getTaskById(Long id);
    List<TaskDTO> getAllTasks();
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    void deleteTask(Long id);
    List<TaskDTO> getTasksByProjectId(Long projectId);
    List<TaskDTO> getTasksByAssignedTo(Long employeeId);
    List<TaskDTO> getTasksByStatus(Task.TaskStatus status);
    List<TaskDTO> getTasksByPriority(Task.TaskPriority priority);
    List<TaskDTO> getTasksByProjectAndStatus(Long projectId, Task.TaskStatus status);
    List<TaskDTO> getOverdueTasks();
    List<TaskDTO> getUpcomingTasks(LocalDate startDate, LocalDate endDate);
    TaskDTO updateTaskStatus(Long id, Task.TaskStatus status);
    Long getTaskCountByStatus(Long projectId, Task.TaskStatus status);
    Long countByAssignedToAndStatusIn(Long employeeId, List<Task.TaskStatus> statuses);
    List<TaskDTO> getFilteredTasks(String status, String priority, Long projectId, Authentication authentication);
}
