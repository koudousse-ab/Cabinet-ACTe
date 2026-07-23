package com.cabinet.acte.dto;

import java.util.List;
import java.util.Map;

public class ChartDataDTO {
    private Map<String, Long> projectsByStatus;
    private Map<String, Long> tasksByStatus;
    private List<DayCount> tasksCompletedPerDay;

    public ChartDataDTO() {}
    public ChartDataDTO(Map<String, Long> projectsByStatus, Map<String, Long> tasksByStatus, List<DayCount> tasksCompletedPerDay) {
        this.projectsByStatus = projectsByStatus;
        this.tasksByStatus = tasksByStatus;
        this.tasksCompletedPerDay = tasksCompletedPerDay;
    }

    public Map<String, Long> getProjectsByStatus() { return projectsByStatus; }
    public void setProjectsByStatus(Map<String, Long> projectsByStatus) { this.projectsByStatus = projectsByStatus; }

    public Map<String, Long> getTasksByStatus() { return tasksByStatus; }
    public void setTasksByStatus(Map<String, Long> tasksByStatus) { this.tasksByStatus = tasksByStatus; }

    public List<DayCount> getTasksCompletedPerDay() { return tasksCompletedPerDay; }
    public void setTasksCompletedPerDay(List<DayCount> tasksCompletedPerDay) { this.tasksCompletedPerDay = tasksCompletedPerDay; }

    public static class DayCount {
        private String date;
        private long count;

        public DayCount() {}
        public DayCount(String date, long count) {
            this.date = date;
            this.count = count;
        }
        public String getDate() { return date; }
        public long getCount() { return count; }
        public void setDate(String date) { this.date = date; }
        public void setCount(long count) { this.count = count; }
    }
}
