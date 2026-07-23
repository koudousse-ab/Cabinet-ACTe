package com.cabinet.acte.dto;

public class DashboardStatsDTO {
    private long totalProjects;
    private long inProgressProjects;
    private long completedProjects;
    private long totalTasks;
    private long tasksInProgress;
    private long tasksCompleted;

    public DashboardStatsDTO() {}
    public DashboardStatsDTO(long totalProjects, long inProgressProjects, long completedProjects,
                             long totalTasks, long tasksInProgress, long tasksCompleted) {
        this.totalProjects = totalProjects;
        this.inProgressProjects = inProgressProjects;
        this.completedProjects = completedProjects;
        this.totalTasks = totalTasks;
        this.tasksInProgress = tasksInProgress;
        this.tasksCompleted = tasksCompleted;
    }

    // Getters et Setters
    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }

    public long getInProgressProjects() { return inProgressProjects; }
    public void setInProgressProjects(long inProgressProjects) { this.inProgressProjects = inProgressProjects; }

    public long getCompletedProjects() { return completedProjects; }
    public void setCompletedProjects(long completedProjects) { this.completedProjects = completedProjects; }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getTasksInProgress() { return tasksInProgress; }
    public void setTasksInProgress(long tasksInProgress) { this.tasksInProgress = tasksInProgress; }

    public long getTasksCompleted() { return tasksCompleted; }
    public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
}
