package com.cabinet.acte.controller;

import com.cabinet.acte.dto.ProjectDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.service.ProjectService;
import com.cabinet.acte.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    // ADMIN et CHEF_PROJET seulement
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO dto, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_EMPLOYE")) {
            throw new AccessDeniedException("Vous n'avez pas le droit de créer un projet");
        }
        ProjectDTO created = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(Authentication auth) {
        // Les employés ne voient que les projets où ils ont des tâches
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_EMPLOYE")) {
            // Le filtrage sera fait côté frontend ou on peut filtrer ici
            // Pour simplifier, on renvoie tous les projets, le frontend filtrera
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO dto, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_EMPLOYE")) {
            throw new AccessDeniedException("Vous n'avez pas le droit de modifier un projet");
        }
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication auth) {
        String role = auth.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_EMPLOYE")) {
            throw new AccessDeniedException("Vous n'avez pas le droit de supprimer un projet");
        }
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskDTO>> getProjectTasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(id));
    }
}
