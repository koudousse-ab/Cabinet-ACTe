package com.cabinet.acte.service;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.entity.Course;

import java.time.LocalDate;
import java.util.List;

public interface CourseService {
    CourseDTO createCourse(CourseDTO courseDTO);
    CourseDTO getCourseById(Long id);
    List<CourseDTO> getAllCourses();
    CourseDTO updateCourse(Long id, CourseDTO courseDTO);
    void deleteCourse(Long id);
    List<CourseDTO> getCoursesForWeek(LocalDate startDate, LocalDate endDate);
    List<CourseDTO> getCoursesByAssignedTo(Long enseignantId);
    List<CourseDTO> getCoursesByClasse(String classe);
    CourseDTO updateCourseStatus(Long id, Course.CourseStatus status);
}
