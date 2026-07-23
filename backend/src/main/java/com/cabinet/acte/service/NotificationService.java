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

    public Notification createNotification(String message, Long employeeId, Long taskId) {
        Notification notif = new Notification(message, employeeId, taskId);
        return notificationRepository.save(notif);
    }

    public List<Notification> getNotificationsForEmployee(Long employeeId) {
        return notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public Long getUnreadCount(Long employeeId) {
        return notificationRepository.countByEmployeeIdAndIsReadFalse(employeeId);
    }

    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    public void markAllAsRead(Long employeeId) {
        List<Notification> notifications = notificationRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
