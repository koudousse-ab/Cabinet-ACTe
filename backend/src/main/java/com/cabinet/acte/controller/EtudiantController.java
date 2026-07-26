package com.cabinet.acte.controller;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.dto.EtudiantDTO;
import com.cabinet.acte.entity.Etudiant;
import com.cabinet.acte.repository.EtudiantRepository;
import com.cabinet.acte.service.EtudiantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @Autowired
    private EtudiantRepository etudiantRepository;

    // Seul l'Admin (par défaut) gère les comptes étudiants
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EtudiantDTO>> getAllEtudiants() {
        return ResponseEntity.ok(etudiantService.getAllEtudiants());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'CHEF_PROJET')")
    public ResponseEntity<List<EtudiantDTO>> searchEtudiants(@RequestParam String q) {
        return ResponseEntity.ok(etudiantService.searchEtudiants(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantDTO> getEtudiantById(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantService.getEtudiantById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EtudiantDTO> createEtudiant(@Valid @RequestBody EtudiantDTO dto) {
        return new ResponseEntity<>(etudiantService.createEtudiant(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EtudiantDTO> updateEtudiant(@PathVariable Long id, @Valid @RequestBody EtudiantDTO dto) {
        return ResponseEntity.ok(etudiantService.updateEtudiant(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEtudiant(@PathVariable Long id) {
        etudiantService.deleteEtudiant(id);
        return ResponseEntity.noContent().build();
    }

    // Programme individuel de l'étudiant connecté (son propre agenda uniquement)
    @GetMapping("/{id}/programme")
    public ResponseEntity<List<CourseDTO>> getProgramme(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantService.getProgrammeEtudiant(id));
    }

    // Utilisateur étudiant connecté
    @GetMapping("/me")
    public ResponseEntity<EtudiantDTO> getCurrentEtudiant(Authentication authentication) {
        String email = authentication.getName();
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        return ResponseEntity.ok(EtudiantDTO.fromEntity(etudiant));
    }
}
