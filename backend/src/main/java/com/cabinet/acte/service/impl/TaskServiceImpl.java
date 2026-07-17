package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Task;
import com.cabinet.acte.repository.TaskRepository;
import com.cabinet.acte.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = taskDTO.toEntity();
        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        return taskRepository.findById(id)
            .map(TaskDTO::fromEntity)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setAssignedTo(taskDTO.getAssignedTo());
        task.setDueDate(taskDTO.getDueDate());
        task.setEstimatedHours(taskDTO.getEstimatedHours());
        task.setActualHours(taskDTO.getActualHours());

        Task updatedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByAssignedTo(Long employeeId) {
        return taskRepository.findByAssignedTo(employeeId).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByStatus(Task.TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByPriority(Task.TaskPriority priority) {
        return taskRepository.findByPriority(priority).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProjectAndStatus(Long projectId, Task.TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDate.now()).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getUpcomingTasks(LocalDate startDate, LocalDate endDate) {
        return taskRepository.findUpcomingTasks(startDate, endDate).stream()
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTaskStatus(Long id, Task.TaskStatus status) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(updatedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTaskCountByStatus(Long projectId, Task.TaskStatus status) {
        return taskRepository.countByProjectIdAndStatus(projectId, status);
    }
}
