package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.entity.Course;
import com.cabinet.acte.repository.CourseRepository;
import com.cabinet.acte.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public CourseDTO createCourse(CourseDTO courseDTO) {
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
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.setTitle(courseDTO.getTitle());
        course.setDescription(courseDTO.getDescription());
        course.setStartDate(courseDTO.getStartDate());
        course.setEndDate(courseDTO.getEndDate());
        course.setStartTime(courseDTO.getStartTime());
        course.setAssignedTo(courseDTO.getAssignedTo());
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
    public List<CourseDTO> getCoursesByAssignedTo(Long employeeId) {
        return courseRepository.findByAssignedTo(employeeId).stream()
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
