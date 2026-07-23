package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssignedTo(Long employeeId);

    List<Task> findByStatus(Task.TaskStatus status);

    List<Task> findByPriority(Task.TaskPriority priority);

    List<Task> findByProjectIdAndStatus(Long projectId, Task.TaskStatus status);

    List<Task> findByDueDateBeforeAndStatusNot(LocalDate dueDate, Task.TaskStatus status);

    List<Task> findByDueDateBetween(LocalDate startDate, LocalDate endDate);

    Long countByProjectIdAndStatus(Long projectId, Task.TaskStatus status);

    Long countByAssignedToAndStatusIn(Long employeeId, List<Task.TaskStatus> statuses);
}
