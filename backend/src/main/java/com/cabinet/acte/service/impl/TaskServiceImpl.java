package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Task;
import com.cabinet.acte.repository.TaskRepository;
import com.cabinet.acte.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Vérifier si l'employé est disponible à cette date et heure
    private void checkAvailability(Long employeeId, LocalDate dueDate, LocalTime scheduledTime, Long excludeTaskId) {
        if (employeeId == null || dueDate == null || scheduledTime == null) {
            return; // Pas de vérification si pas d'assignation ou de date/heure
        }
        List<Task> conflictingTasks = taskRepository.findByAssignedToAndDueDateAndScheduledTime(employeeId, dueDate, scheduledTime);
        // Exclure la tâche en cours de modification
        if (excludeTaskId != null) {
            conflictingTasks.removeIf(t -> t.getId().equals(excludeTaskId));
        }
        if (!conflictingTasks.isEmpty()) {
            throw new RuntimeException("L'employé est déjà occupé à cette date et heure.");
        }
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        checkAvailability(taskDTO.getAssignedTo(), taskDTO.getDueDate(), taskDTO.getScheduledTime(), null);
        Task task = taskDTO.toEntity();
        Task saved = taskRepository.save(task);
        return TaskDTO.fromEntity(saved);
    }

    @Override
    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
                .map(TaskDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        checkAvailability(taskDTO.getAssignedTo(), taskDTO.getDueDate(), taskDTO.getScheduledTime(), id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setProjectId(taskDTO.getProjectId());
        task.setAssignedTo(taskDTO.getAssignedTo());
        task.setDueDate(taskDTO.getDueDate());
        task.setEstimatedHours(taskDTO.getEstimatedHours());
        task.setActualHours(taskDTO.getActualHours());
        task.setScheduledTime(taskDTO.getScheduledTime());
        Task updated = taskRepository.save(task);
        return TaskDTO.fromEntity(updated);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    @Override
    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByAssignedTo(Long employeeId) {
        return taskRepository.findByAssignedTo(employeeId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByPriority(Task.TaskPriority priority) {
        return taskRepository.findByPriority(priority).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getTasksByProjectAndStatus(Long projectId, Task.TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getOverdueTasks() {
        LocalDate today = LocalDate.now();
        return taskRepository.findByDueDateBeforeAndStatusNot(today, Task.TaskStatus.DONE).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> getUpcomingTasks(LocalDate startDate, LocalDate endDate) {
        return taskRepository.findByDueDateBetween(startDate, endDate).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTaskStatus(Long id, Task.TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return TaskDTO.fromEntity(updated);
    }

    @Override
    public Long getTaskCountByStatus(Long projectId, Task.TaskStatus status) {
        return taskRepository.countByProjectIdAndStatus(projectId, status);
    }

    @Override
    public Long countByAssignedToAndStatusIn(Long employeeId, List<Task.TaskStatus> statuses) {
        return taskRepository.countByAssignedToAndStatusIn(employeeId, statuses);
    }

    @Override
    public List<TaskDTO> getFilteredTasks(String status, String priority, Long projectId, Authentication authentication) {
        return getAllTasks(); // simplifié
    }
}
