package com.cabinet.acte.service;

import com.cabinet.acte.entity.Notification;
import com.cabinet.acte.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String message, Long enseignantId, Long taskId) {
        Notification notif = new Notification(message, enseignantId, taskId);
        return notificationRepository.save(notif);
    }

    public List<Notification> getNotificationsForEnseignant(Long enseignantId) {
        return notificationRepository.findByEnseignantIdOrderByCreatedAtDesc(enseignantId);
    }

    public Long getUnreadCount(Long enseignantId) {
        return notificationRepository.countByEnseignantIdAndIsReadFalse(enseignantId);
    }

    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    public void markAllAsRead(Long enseignantId) {
        List<Notification> notifications = notificationRepository.findByEnseignantIdOrderByCreatedAtDesc(enseignantId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
