package com.cabinet.acte.repository;

import com.cabinet.acte.entity.ErrorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {

    List<ErrorLog> findByEmployeeId(Long employeeId);

    List<ErrorLog> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate start, LocalDate end);

    long countByEmployeeIdAndDateBetween(Long employeeId, LocalDate start, LocalDate end);

    List<ErrorLog> findByDateBetween(LocalDate start, LocalDate end);
}
