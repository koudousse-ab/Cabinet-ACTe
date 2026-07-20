package com.cabinet.acte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportDTO {

    private LocalDate weekStart;
    private LocalDate weekEnd;
    private long tasksPlanned;
    private long tasksInProgress;
    private long tasksCompleted;
    private List<EmployeeWeeklySummary> employeeSummaries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeWeeklySummary {
        private Long employeeId;
        private String employeeName;
        private long tasksCompleted;
        private long errorsCount;
    }
}
