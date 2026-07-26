package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByEmail(String email);
    List<Etudiant> findByClasse(String classe);
    List<Etudiant> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
