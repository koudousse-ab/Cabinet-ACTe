package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.entity.Course;
import com.cabinet.acte.exception.TaskException;
import com.cabinet.acte.repository.CourseRepository;
import com.cabinet.acte.repository.EtudiantRepository;
import com.cabinet.acte.repository.TaskRepository;
import com.cabinet.acte.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    // Transitions de statut autorisées pour un cours : Planifié -> En cours -> Terminé.
    // Un cours peut aussi être annulé depuis Planifié ou En cours ; un statut terminal ne peut plus changer.
    private static final Map<Course.CourseStatus, Set<Course.CourseStatus>> ALLOWED_TRANSITIONS = new LinkedHashMap<>();
    static {
        ALLOWED_TRANSITIONS.put(Course.CourseStatus.PLANNED, new LinkedHashSet<>(List.of(Course.CourseStatus.IN_PROGRESS, Course.CourseStatus.CANCELLED)));
        ALLOWED_TRANSITIONS.put(Course.CourseStatus.IN_PROGRESS, new LinkedHashSet<>(List.of(Course.CourseStatus.COMPLETED, Course.CourseStatus.CANCELLED)));
        ALLOWED_TRANSITIONS.put(Course.CourseStatus.COMPLETED, Set.of());
        ALLOWED_TRANSITIONS.put(Course.CourseStatus.CANCELLED, Set.of());
    }

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
    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Long id) {
        return courseRepository.findById(id)
                .map(CourseDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
    }

    @Override
    @Transactional(readOnly = true)
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
        course.setEndTime(courseDTO.getEndTime());
        course.setAssignedTo(courseDTO.getAssignedTo());
        course.setClasse(courseDTO.getClasse());
        course.getStudentIds().clear();
        if (courseDTO.getStudentIds() != null) {
            course.getStudentIds().addAll(courseDTO.getStudentIds());
        }
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
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesForWeek(LocalDate startDate, LocalDate endDate) {
        return courseRepository.findByStartDateBetween(startDate, endDate).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByAssignedTo(Long enseignantId) {
        return courseRepository.findByAssignedTo(enseignantId).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByClasse(String classe) {
        return courseRepository.findByClasse(classe).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Programme individuel d'un étudiant : cours cochés individuellement pour lui,
    // complétés par les cours assignés à sa classe (compatibilité avec l'existant).
    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getCoursesByEtudiant(Long etudiantId) {
        Map<Long, Course> merged = new LinkedHashMap<>();
        courseRepository.findByStudentId(etudiantId).forEach(c -> merged.put(c.getId(), c));

        etudiantRepository.findById(etudiantId).ifPresent(etudiant -> {
            if (etudiant.getClasse() != null && !etudiant.getClasse().isBlank()) {
                courseRepository.findByClasse(etudiant.getClasse()).forEach(c -> merged.put(c.getId(), c));
            }
        });

        return merged.values().stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO updateCourseStatus(Long id, Course.CourseStatus status) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        Course.CourseStatus current = course.getStatus();
        Set<Course.CourseStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!status.equals(current) && !allowed.contains(status)) {
            throw new TaskException(
                    "Transition de statut invalide : un cours " + labelOf(current) + " ne peut pas passer directement à " + labelOf(status),
                    "TRANSITION_STATUT_INVALIDE"
            );
        }

        course.setStatus(status);
        Course updated = courseRepository.save(course);
        return CourseDTO.fromEntity(updated);
    }

    private String labelOf(Course.CourseStatus status) {
        return switch (status) {
            case PLANNED -> "Planifié";
            case IN_PROGRESS -> "En cours";
            case COMPLETED -> "Terminé";
            case CANCELLED -> "Annulé";
        };
    }
}
