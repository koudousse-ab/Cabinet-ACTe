package com.cabinet.acte.dto;

import java.time.LocalDate;
import java.util.List;

public class WeeklyReportDTO {
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private long tasksPlanned;
    private long tasksInProgress;
    private long tasksCompleted;
    private List<EnseignantWeeklySummary> enseignantSummaries;

    public WeeklyReportDTO() {}
    public WeeklyReportDTO(LocalDate weekStart, LocalDate weekEnd, long tasksPlanned,
                           long tasksInProgress, long tasksCompleted, List<EnseignantWeeklySummary> enseignantSummaries) {
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.tasksPlanned = tasksPlanned;
        this.tasksInProgress = tasksInProgress;
        this.tasksCompleted = tasksCompleted;
        this.enseignantSummaries = enseignantSummaries;
    }

    public LocalDate getWeekStart() { return weekStart; }
    public LocalDate getWeekEnd() { return weekEnd; }
    public long getTasksPlanned() { return tasksPlanned; }
    public long getTasksInProgress() { return tasksInProgress; }
    public long getTasksCompleted() { return tasksCompleted; }
    public List<EnseignantWeeklySummary> getEnseignantSummaries() { return enseignantSummaries; }

    public void setWeekStart(LocalDate weekStart) { this.weekStart = weekStart; }
    public void setWeekEnd(LocalDate weekEnd) { this.weekEnd = weekEnd; }
    public void setTasksPlanned(long tasksPlanned) { this.tasksPlanned = tasksPlanned; }
    public void setTasksInProgress(long tasksInProgress) { this.tasksInProgress = tasksInProgress; }
    public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
    public void setEnseignantSummaries(List<EnseignantWeeklySummary> enseignantSummaries) { this.enseignantSummaries = enseignantSummaries; }

    public static class EnseignantWeeklySummary {
        private Long enseignantId;
        private String enseignantName;
        private long tasksCompleted;
        private long errorsCount;

        public EnseignantWeeklySummary() {}
        public EnseignantWeeklySummary(Long enseignantId, String enseignantName, long tasksCompleted, long errorsCount) {
            this.enseignantId = enseignantId;
            this.enseignantName = enseignantName;
            this.tasksCompleted = tasksCompleted;
            this.errorsCount = errorsCount;
        }

        public Long getEnseignantId() { return enseignantId; }
        public String getEnseignantName() { return enseignantName; }
        public long getTasksCompleted() { return tasksCompleted; }
        public long getErrorsCount() { return errorsCount; }

        public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }
        public void setEnseignantName(String enseignantName) { this.enseignantName = enseignantName; }
        public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
        public void setErrorsCount(long errorsCount) { this.errorsCount = errorsCount; }
    }
}
