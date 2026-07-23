package com.cabinet.acte.dto;

import java.util.List;

public class RecentActivityDTO {
    private List<ProjectDTO> recentProjects;
    private List<TaskDTO> recentTasks;

    public RecentActivityDTO() {}
    public RecentActivityDTO(List<ProjectDTO> recentProjects, List<TaskDTO> recentTasks) {
        this.recentProjects = recentProjects;
        this.recentTasks = recentTasks;
    }

    public List<ProjectDTO> getRecentProjects() { return recentProjects; }
    public void setRecentProjects(List<ProjectDTO> recentProjects) { this.recentProjects = recentProjects; }

    public List<TaskDTO> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskDTO> recentTasks) { this.recentTasks = recentTasks; }
}
