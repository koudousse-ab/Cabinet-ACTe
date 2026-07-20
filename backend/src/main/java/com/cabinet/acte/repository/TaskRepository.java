package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks by project ID
     */
    List<Task> findByProjectId(Long projectId);

    /**
     * Find all tasks assigned to an employee
     */
    List<Task> findByAssignedTo(Long employeeId);

    /**
     * Find tasks by status
     */
    List<Task> findByStatus(Task.TaskStatus status);

    /**
     * Find tasks by priority
     */
    List<Task> findByPriority(Task.TaskPriority priority);

    /**
     * Find tasks by project and status
     */
    List<Task> findByProjectIdAndStatus(Long projectId, Task.TaskStatus status);

    /**
     * Find tasks by project and assigned employee
     */
    List<Task> findByProjectIdAndAssignedTo(Long projectId, Long employeeId);

    /**
     * Find overdue tasks
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status != 'TERMINE'")
    List<Task> findOverdueTasks(@Param("today") LocalDate today);

    /**
     * Find tasks due soon
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :startDate AND :endDate AND t.status != 'TERMINE'")
    List<Task> findUpcomingTasks(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Count tasks by status for a project
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.projectId = :projectId AND t.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") Task.TaskStatus status);
}
