package com.cabinet.acte.dto;

import java.time.LocalDate;
import java.util.List;

public class WeeklyReportDTO {
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private long tasksPlanned;
    private long tasksInProgress;
    private long tasksCompleted;
    private List<EmployeeWeeklySummary> employeeSummaries;

    public WeeklyReportDTO() {}
    public WeeklyReportDTO(LocalDate weekStart, LocalDate weekEnd, long tasksPlanned,
                           long tasksInProgress, long tasksCompleted, List<EmployeeWeeklySummary> employeeSummaries) {
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.tasksPlanned = tasksPlanned;
        this.tasksInProgress = tasksInProgress;
        this.tasksCompleted = tasksCompleted;
        this.employeeSummaries = employeeSummaries;
    }

    public LocalDate getWeekStart() { return weekStart; }
    public LocalDate getWeekEnd() { return weekEnd; }
    public long getTasksPlanned() { return tasksPlanned; }
    public long getTasksInProgress() { return tasksInProgress; }
    public long getTasksCompleted() { return tasksCompleted; }
    public List<EmployeeWeeklySummary> getEmployeeSummaries() { return employeeSummaries; }

    public void setWeekStart(LocalDate weekStart) { this.weekStart = weekStart; }
    public void setWeekEnd(LocalDate weekEnd) { this.weekEnd = weekEnd; }
    public void setTasksPlanned(long tasksPlanned) { this.tasksPlanned = tasksPlanned; }
    public void setTasksInProgress(long tasksInProgress) { this.tasksInProgress = tasksInProgress; }
    public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
    public void setEmployeeSummaries(List<EmployeeWeeklySummary> employeeSummaries) { this.employeeSummaries = employeeSummaries; }

    public static class EmployeeWeeklySummary {
        private Long employeeId;
        private String employeeName;
        private long tasksCompleted;
        private long errorsCount;

        public EmployeeWeeklySummary() {}
        public EmployeeWeeklySummary(Long employeeId, String employeeName, long tasksCompleted, long errorsCount) {
            this.employeeId = employeeId;
            this.employeeName = employeeName;
            this.tasksCompleted = tasksCompleted;
            this.errorsCount = errorsCount;
        }

        public Long getEmployeeId() { return employeeId; }
        public String getEmployeeName() { return employeeName; }
        public long getTasksCompleted() { return tasksCompleted; }
        public long getErrorsCount() { return errorsCount; }

        public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
        public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
        public void setTasksCompleted(long tasksCompleted) { this.tasksCompleted = tasksCompleted; }
        public void setErrorsCount(long errorsCount) { this.errorsCount = errorsCount; }
    }
}
