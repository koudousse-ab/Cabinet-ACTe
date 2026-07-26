package com.cabinet.acte.repository;

import com.cabinet.acte.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    List<Enseignant> findByRole(Enseignant.EnseignantRole role);
    List<Enseignant> findByRoleIn(List<Enseignant.EnseignantRole> roles);
    Optional<Enseignant> findByEmail(String email);
    List<Enseignant> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
