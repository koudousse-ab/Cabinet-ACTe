package com.cabinet.acte.service;

import com.cabinet.acte.dto.CourseDTO;
import com.cabinet.acte.dto.EtudiantDTO;

import java.util.List;

public interface EtudiantService {
    EtudiantDTO createEtudiant(EtudiantDTO dto);
    EtudiantDTO getEtudiantById(Long id);
    List<EtudiantDTO> getAllEtudiants();
    EtudiantDTO updateEtudiant(Long id, EtudiantDTO dto);
    void deleteEtudiant(Long id);
    List<EtudiantDTO> searchEtudiants(String query);

    // Programme individuel de l'étudiant (cours de sa classe)
    List<CourseDTO> getProgrammeEtudiant(Long id);
}
