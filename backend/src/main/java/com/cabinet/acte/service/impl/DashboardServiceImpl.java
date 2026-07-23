package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.ChartDataDTO;
import com.cabinet.acte.dto.DashboardStatsDTO;
import com.cabinet.acte.dto.ProjectDTO;
import com.cabinet.acte.dto.RecentActivityDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Project;
import com.cabinet.acte.entity.Task;
import com.cabinet.acte.repository.ProjectRepository;
import com.cabinet.acte.repository.TaskRepository;
import com.cabinet.acte.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public DashboardStatsDTO getStats() {
        List<Project> allProjects = projectRepository.findAll();
        List<Task> allTasks = taskRepository.findAll();

        long totalProjects = allProjects.size();
        long inProgressProjects = allProjects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.EN_COURS)
                .count();
        long completedProjects = allProjects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.TERMINE)
                .count();

        long totalTasks = allTasks.size();
        long tasksInProgress = allTasks.stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS)
                .count();
        long tasksCompleted = allTasks.stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.DONE)
                .count();

        return new DashboardStatsDTO(
                totalProjects,
                inProgressProjects,
                completedProjects,
                totalTasks,
                tasksInProgress,
                tasksCompleted
        );
    }

    @Override
    public ChartDataDTO getChartData() {
        // Projets par statut
        Map<String, Long> projectsByStatus = projectRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        p -> p.getStatus().name(),
                        Collectors.counting()
                ));

        // Tâches par statut
        Map<String, Long> tasksByStatus = taskRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        t -> t.getStatus().name(),
                        Collectors.counting()
                ));

        // Tâches complétées par jour (7 derniers jours)
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate today = LocalDate.now();
        List<ChartDataDTO.DayCount> tasksCompletedPerDay = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            String dateStr = day.format(fmt);
            long count = taskRepository.findAll().stream()
                    .filter(t -> t.getStatus() == Task.TaskStatus.DONE)
                    .filter(t -> t.getUpdatedAt() != null)
                    .filter(t -> t.getUpdatedAt().toLocalDate().equals(day))
                    .count();
            tasksCompletedPerDay.add(new ChartDataDTO.DayCount(dateStr, count));
        }

        return new ChartDataDTO(projectsByStatus, tasksByStatus, tasksCompletedPerDay);
    }

    @Override
    public RecentActivityDTO getRecentActivity() {
        List<ProjectDTO> recentProjects = projectRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());

        List<TaskDTO> recentTasks = taskRepository.findAll().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(5)
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());

        return new RecentActivityDTO(recentProjects, recentTasks);
    }
}
