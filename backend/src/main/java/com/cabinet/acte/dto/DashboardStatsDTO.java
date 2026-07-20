package com.cabinet.acte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalProjects;
    private long inProgressProjects;
    private long completedProjects;
    private long totalTasks;
    private long tasksInProgress;
    private long tasksCompleted;
}
