package com.cabinet.acte.controller;

import com.cabinet.acte.config.security.PresenceTracker;
import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.entity.Etudiant;
import com.cabinet.acte.repository.EnseignantRepository;
import com.cabinet.acte.repository.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/presence")
public class PresenceController {

    private static final long ONLINE_THRESHOLD_SECONDS = 5 * 60;

    @Autowired
    private PresenceTracker presenceTracker;

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private EtudiantRepository etudiantRepository;

    public record OnlineUser(String email, String name, String role, long secondsAgo) {}

    @GetMapping("/online")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<List<OnlineUser>> getOnlineUsers() {
        Instant now = Instant.now();

        List<OnlineUser> online = presenceTracker.getAll().entrySet().stream()
                .filter(e -> Duration.between(e.getValue(), now).getSeconds() <= ONLINE_THRESHOLD_SECONDS)
                .map(e -> resolveUser(e.getKey(), Duration.between(e.getValue(), now).getSeconds()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .sorted(Comparator.comparingLong(OnlineUser::secondsAgo))
                .collect(Collectors.toList());

        return ResponseEntity.ok(online);
    }

    private Optional<OnlineUser> resolveUser(String email, long secondsAgo) {
        Optional<Enseignant> enseignant = enseignantRepository.findByEmail(email);
        if (enseignant.isPresent()) {
            Enseignant e = enseignant.get();
            return Optional.of(new OnlineUser(e.getEmail(), e.getName(), e.getRole().name(), secondsAgo));
        }
        Optional<Etudiant> etudiant = etudiantRepository.findByEmail(email);
        if (etudiant.isPresent()) {
            Etudiant e = etudiant.get();
            return Optional.of(new OnlineUser(e.getEmail(), e.getName(), "ETUDIANT", secondsAgo));
        }
        return Optional.empty();
    }
}
