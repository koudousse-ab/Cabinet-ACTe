package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByStatus(Project.ProjectStatus status);

    List<Project> findByClient(String client);

    List<Project> findByStatusAndClient(Project.ProjectStatus status, String client);

    long countByStatus(Project.ProjectStatus status);

    List<Project> findByNameContainingIgnoreCaseOrClientContainingIgnoreCase(String name, String client);
}
