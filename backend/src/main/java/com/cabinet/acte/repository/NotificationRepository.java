package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEnseignantIdOrderByCreatedAtDesc(Long enseignantId);
    Long countByEnseignantIdAndIsReadFalse(Long enseignantId);
}
