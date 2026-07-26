package com.cabinet.acte.controller;

import com.cabinet.acte.dto.EnseignantDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.repository.EnseignantRepository;
import com.cabinet.acte.service.EnseignantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enseignants")
public class EnseignantController {

    @Autowired
    private EnseignantService enseignantService;

    @Autowired
    private EnseignantRepository enseignantRepository;

    // Liste en lecture accessible à tous les utilisateurs authentifiés (ex: afficher un nom d'enseignant)
    @GetMapping
    public ResponseEntity<List<EnseignantDTO>> getAllEnseignants() {
        return ResponseEntity.ok(enseignantService.getAllEnseignants());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<List<EnseignantDTO>> searchEnseignants(@RequestParam String q) {
        return ResponseEntity.ok(enseignantService.searchEnseignants(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnseignantDTO> getEnseignantById(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getEnseignantById(id));
    }

    // Seul l'Admin crée des comptes (gestion des permissions par défaut)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnseignantDTO> createEnseignant(@Valid @RequestBody EnseignantDTO enseignantDTO) {
        EnseignantDTO created = enseignantService.createEnseignant(enseignantDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnseignantDTO> updateEnseignant(@PathVariable Long id, @Valid @RequestBody EnseignantDTO enseignantDTO) {
        return ResponseEntity.ok(enseignantService.updateEnseignant(id, enseignantDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnseignant(@PathVariable Long id) {
        enseignantService.deleteEnseignant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskDTO>> getEnseignantTasks(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getEnseignantTasks(id));
    }

    @GetMapping("/{id}/errors")
    public ResponseEntity<List<ErrorLogDTO>> getEnseignantErrors(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getEnseignantErrors(id));
    }

    @PostMapping("/errors")
    public ResponseEntity<ErrorLogDTO> addError(@Valid @RequestBody ErrorLogDTO errorLogDTO) {
        return new ResponseEntity<>(enseignantService.addError(errorLogDTO), HttpStatus.CREATED);
    }

    // ═══════ NOUVEAU ENDPOINT : Récupérer l'utilisateur connecté ═══════
    @GetMapping("/me")
    public ResponseEntity<EnseignantDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Enseignant enseignant = enseignantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
        return ResponseEntity.ok(EnseignantDTO.fromEntity(enseignant));
    }
}
