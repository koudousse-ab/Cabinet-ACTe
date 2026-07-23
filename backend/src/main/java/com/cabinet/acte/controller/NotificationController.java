package com.cabinet.acte.controller;

import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.entity.Notification;
import com.cabinet.acte.repository.EmployeeRepository;
import com.cabinet.acte.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        return ResponseEntity.ok(notificationService.getNotificationsForEmployee(employee.getId()));
    }

    @GetMapping("/unread")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        return ResponseEntity.ok(notificationService.getUnreadCount(employee.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        notificationService.markAllAsRead(employee.getId());
        return ResponseEntity.ok().build();
    }
}
