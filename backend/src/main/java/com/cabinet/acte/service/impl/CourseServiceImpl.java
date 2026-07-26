package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.entity.Course;
import com.cabinet.acte.exception.TaskException;
import com.cabinet.acte.repository.CourseRepository;
import com.cabinet.acte.repository.TaskRepository;
import com.cabinet.acte.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TaskRepository taskRepository;

    // Vérifie que l'enseignant n'est pas déjà occupé (autre cours OU tâche) à la même date/heure
    private void checkAvailability(Long enseignantId, LocalDate startDate, LocalTime startTime, Long excludeCourseId) {
        if (enseignantId == null || startDate == null || startTime == null) {
            return;
        }
        List<Course> conflictingCourses = courseRepository.findByAssignedToAndStartDateAndStartTime(enseignantId, startDate, startTime);
        if (excludeCourseId != null) {
            conflictingCourses.removeIf(c -> c.getId().equals(excludeCourseId));
        }
        boolean conflitTache = !taskRepository.findByAssignedToAndDueDateAndScheduledTime(enseignantId, startDate, startTime).isEmpty();
        if (!conflictingCourses.isEmpty() || conflitTache) {
            throw new TaskException("déjà occupé", "ENSEIGNANT_DEJA_OCCUPE");
        }
    }

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
        checkAvailability(courseDTO.getAssignedTo(), courseDTO.getStartDate(), courseDTO.getStartTime(), null);
        Course course = courseDTO.toEntity();
        Course saved = courseRepository.save(course);
        return CourseDTO.fromEntity(saved);
    }

    @Override
    public CourseDTO getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(CourseDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        checkAvailability(courseDTO.getAssignedTo(), courseDTO.getStartDate(), courseDTO.getStartTime(), id);
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setStartDate(courseDTO.getStartDate());
        course.setEndDate(courseDTO.getEndDate());
        course.setStartTime(courseDTO.getStartTime());
        course.setAssignedTo(courseDTO.getAssignedTo());
        course.setClasse(courseDTO.getClasse());
        course.setStatus(courseDTO.getStatus());
        Course updated = courseRepository.save(course);
        return CourseDTO.fromEntity(updated);
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Cours non trouvé");
        }
        courseRepository.deleteById(id);
    }

    @Override
    public List<CourseDTO> getCoursesForWeek(LocalDate startDate, LocalDate endDate) {
        return courseRepository.findByStartDateBetween(startDate, endDate).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getCoursesByAssignedTo(Long enseignantId) {
        return courseRepository.findByAssignedTo(enseignantId).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getCoursesByClasse(String classe) {
        return courseRepository.findByClasse(classe).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO updateCourseStatus(Long id, Course.CourseStatus status) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.setStatus(status);
        Course updated = courseRepository.save(course);
        return CourseDTO.fromEntity(updated);
    }
}
