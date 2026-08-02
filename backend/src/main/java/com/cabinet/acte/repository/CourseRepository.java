package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStartDateBetween(LocalDate start, LocalDate end);
    List<Course> findByAssignedTo(Long enseignantId);
    List<Course> findByClasse(String classe);
    List<Course> findByTitleContainingIgnoreCase(String title);

    // Vérification de conflit horaire : un enseignant déjà occupé sur ce cours au même jour/heure
    List<Course> findByAssignedToAndStartDateAndStartTime(Long enseignantId, LocalDate startDate, LocalTime startTime);

    // Cours auxquels un étudiant a été individuellement assigné par cases à cocher
    @Query("SELECT DISTINCT c FROM Course c JOIN c.studentIds s WHERE s = :etudiantId")
    List<Course> findByStudentId(@Param("etudiantId") Long etudiantId);
}
