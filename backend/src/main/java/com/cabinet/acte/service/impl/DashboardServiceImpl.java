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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public DashboardStatsDTO getStats() {
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();

        long totalProjects = projects.size();
        long inProgressProjects = projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.EN_COURS).count();
        long completedProjects = projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.TERMINE).count();

        long totalTasks = tasks.size();
        long tasksInProgress = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.EN_COURS).count();
        long tasksCompleted = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.TERMINE).count();

        return new DashboardStatsDTO(totalProjects, inProgressProjects, completedProjects, totalTasks, tasksInProgress, tasksCompleted);
    }

    @Override
    public ChartDataDTO getChartData() {
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();

        Map<String, Long> projectsByStatus = new LinkedHashMap<>();
        for (Project.ProjectStatus status : Project.ProjectStatus.values()) {
            projectsByStatus.put(status.name(), projects.stream().filter(p -> p.getStatus() == status).count());
        }

        Map<String, Long> tasksByStatus = new LinkedHashMap<>();
        for (Task.TaskStatus status : Task.TaskStatus.values()) {
            tasksByStatus.put(status.name(), tasks.stream().filter(t -> t.getStatus() == status).count());
        }

        List<ChartDataDTO.DayCount> tasksCompletedPerDay = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            long count = tasks.stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.TERMINE)
                .filter(t -> t.getUpdatedAt() != null && t.getUpdatedAt().toLocalDate().equals(day))
                .count();
            tasksCompletedPerDay.add(new ChartDataDTO.DayCount(day.format(fmt), count));
        }

        return new ChartDataDTO(projectsByStatus, tasksByStatus, tasksCompletedPerDay);
    }

    @Override
    public RecentActivityDTO getRecentActivity() {
        List<ProjectDTO> recentProjects = projectRepository.findAll().stream()
            .sorted(Comparator.comparing(Project::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(5)
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());

        List<TaskDTO> recentTasks = taskRepository.findAll().stream()
            .sorted(Comparator.comparing(Task::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(5)
            .map(TaskDTO::fromEntity)
            .collect(Collectors.toList());

        return new RecentActivityDTO(recentProjects, recentTasks);
    }
}
