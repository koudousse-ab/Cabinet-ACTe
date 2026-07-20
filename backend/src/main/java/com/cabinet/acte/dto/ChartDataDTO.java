package com.cabinet.acte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataDTO {
    private Map<String, Long> projectsByStatus;
    private Map<String, Long> tasksByStatus;
    private List<DayCount> tasksCompletedPerDay;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayCount {
        private String date;
        private long count;
    }
}
