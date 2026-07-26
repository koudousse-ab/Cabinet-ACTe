package com.cabinet.acte.controller;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.entity.Course;
import com.cabinet.acte.service.CourseService;
import com.cabinet.acte.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<CourseDTO> createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO created = courseService.createCourse(courseDTO);
        if (courseDTO.getAssignedTo() != null) {
            notificationService.createNotification(
                "Un nouveau cours vous a été assigné : " + created.getTitle(),
                courseDTO.getAssignedTo(),
                null
            );
        }
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // Programme complet : réservé à l'Admin (et Chef de projet pour la gestion)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO courseDTO) {
        CourseDTO updated = courseService.updateCourse(id, courseDTO);
        if (courseDTO.getAssignedTo() != null) {
            notificationService.createNotification(
                "Le cours '" + updated.getTitle() + "' a été mis à jour",
                courseDTO.getAssignedTo(),
                null
            );
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // Programme complet de la semaine : réservé à l'Admin/Chef de projet.
    // Enseignant/Étudiant : utiliser /assigned/{id} ou /classe/{classe} pour leur programme individuel.
    @GetMapping("/week")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<List<CourseDTO>> getCoursesForWeek(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(courseService.getCoursesForWeek(start, end));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CourseDTO> updateCourseStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Course.CourseStatus newStatus = Course.CourseStatus.valueOf(status.toUpperCase());
        CourseDTO updated = courseService.updateCourseStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/assigned/{enseignantId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByAssignedTo(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(courseService.getCoursesByAssignedTo(enseignantId));
    }

    // Programme individuel d'une classe (utilisé par les étudiants)
    @GetMapping("/classe/{classe}")
    public ResponseEntity<List<CourseDTO>> getCoursesByClasse(@PathVariable String classe) {
        return ResponseEntity.ok(courseService.getCoursesByClasse(classe));
    }
}
