package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.ProjectDTO;
import com.cabinet.acte.entity.Project;
import com.cabinet.acte.repository.ProjectRepository;
import com.cabinet.acte.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = projectDTO.toEntity();
        Project saved = projectRepository.save(project);
        return ProjectDTO.fromEntity(saved);
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(ProjectDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(projectDTO.getName());
        project.setClient(projectDTO.getClient());
        project.setDescription(projectDTO.getDescription());
        project.setStatus(projectDTO.getStatus());
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        Project updated = projectRepository.save(project);
        return ProjectDTO.fromEntity(updated);
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    @Override
    public List<ProjectDTO> getProjectsByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatus(status).stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public List<ProjectDTO> filterProjects(Project.ProjectStatus status, String client) {
        return projectRepository.findAll().stream()
            .filter(p -> status == null || p.getStatus() == status)
            .filter(p -> client == null || client.isEmpty() || p.getClient().toLowerCase().contains(client.toLowerCase()))
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
    }
    @Override
    public List<ProjectDTO> getProjectsByClient(String client) {
        return projectRepository.findAll().stream()
            .filter(p -> client == null || client.isEmpty() || p.getClient().toLowerCase().contains(client.toLowerCase()))
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> searchProjects(String query) {
        return projectRepository.findByNameContainingIgnoreCaseOrClientContainingIgnoreCase(query, query).stream()
            .map(ProjectDTO::fromEntity)
            .collect(Collectors.toList());
    }
}
