package com.cabinet.acte.config.security;

import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.entity.Etudiant;
import com.cabinet.acte.repository.EnseignantRepository;
import com.cabinet.acte.repository.EtudiantRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final EnseignantRepository enseignantRepository;
    private final EtudiantRepository etudiantRepository;

    public CustomUserDetailsService(EnseignantRepository enseignantRepository, EtudiantRepository etudiantRepository) {
        this.enseignantRepository = enseignantRepository;
        this.etudiantRepository = etudiantRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Un utilisateur est soit dans la table enseignant (ADMIN / CHEF_PROJET / ENSEIGNANT),
        // soit dans la table etudiant (rôle ETUDIANT implicite).
        Optional<Enseignant> enseignant = enseignantRepository.findByEmail(email);
        if (enseignant.isPresent()) {
            return new User(
                    enseignant.get().getEmail(),
                    enseignant.get().getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + enseignant.get().getRole().name()))
            );
        }

        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec cet email: " + email));

        return new User(
                etudiant.getEmail(),
                etudiant.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ETUDIANT"))
        );
    }
}
