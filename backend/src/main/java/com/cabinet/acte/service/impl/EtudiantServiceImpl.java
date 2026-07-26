package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.dto.EtudiantDTO;
import com.cabinet.acte.entity.Etudiant;
import com.cabinet.acte.repository.CourseRepository;
import com.cabinet.acte.repository.EtudiantRepository;
import com.cabinet.acte.service.EtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EtudiantServiceImpl implements EtudiantService {

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public EtudiantDTO createEtudiant(EtudiantDTO dto) {
        Etudiant etudiant = dto.toEntity();
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            etudiant.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return EtudiantDTO.fromEntity(etudiantRepository.save(etudiant));
    }

    @Override
    @Transactional(readOnly = true)
    public EtudiantDTO getEtudiantById(Long id) {
        return etudiantRepository.findById(id)
                .map(EtudiantDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EtudiantDTO> getAllEtudiants() {
        return etudiantRepository.findAll().stream()
                .map(EtudiantDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public EtudiantDTO updateEtudiant(Long id, EtudiantDTO dto) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec id: " + id));
        etudiant.setName(dto.getName());
        etudiant.setEmail(dto.getEmail());
        etudiant.setClasse(dto.getClasse());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            etudiant.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return EtudiantDTO.fromEntity(etudiantRepository.save(etudiant));
    }

    @Override
    public void deleteEtudiant(Long id) {
        if (!etudiantRepository.existsById(id)) {
            throw new RuntimeException("Étudiant non trouvé avec id: " + id);
        }
        etudiantRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EtudiantDTO> searchEtudiants(String query) {
        return etudiantRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
                .map(EtudiantDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseDTO> getProgrammeEtudiant(Long id) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé avec id: " + id));
        if (etudiant.getClasse() == null) {
            return List.of();
        }
        return courseRepository.findByClasse(etudiant.getClasse()).stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
