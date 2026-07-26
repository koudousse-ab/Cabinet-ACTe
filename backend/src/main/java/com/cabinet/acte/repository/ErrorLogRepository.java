package com.cabinet.acte.repository;

import com.cabinet.acte.entity.ErrorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {

    List<ErrorLog> findByEnseignantId(Long enseignantId);

    List<ErrorLog> findByEnseignantIdAndDateBetween(Long enseignantId, LocalDate start, LocalDate end);

    long countByEnseignantIdAndDateBetween(Long enseignantId, LocalDate start, LocalDate end);

    List<ErrorLog> findByDateBetween(LocalDate start, LocalDate end);
}
