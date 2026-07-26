package com.cabinet.acte.controller;

import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.entity.Notification;
import com.cabinet.acte.repository.EnseignantRepository;
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
    private EnseignantRepository enseignantRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        return ResponseEntity.ok(notificationService.getNotificationsForEnseignant(enseignant.getId()));
    }

    @GetMapping("/unread")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        return ResponseEntity.ok(notificationService.getUnreadCount(enseignant.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        notificationService.markAllAsRead(enseignant.getId());
        return ResponseEntity.ok().build();
    }
}
