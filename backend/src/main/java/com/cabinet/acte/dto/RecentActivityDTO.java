package com.cabinet.acte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentActivityDTO {
    private List<ProjectDTO> recentProjects;
    private List<TaskDTO> recentTasks;
}
