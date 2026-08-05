package com.cabinet.acte.config.security;

import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.repository.EnseignantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final EnseignantRepository enseignantRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@cabinet-acte.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    public DataInitializer(EnseignantRepository enseignantRepository, PasswordEncoder passwordEncoder) {
        this.enseignantRepository = enseignantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (enseignantRepository.findByEmail(adminEmail).isEmpty()) {
            Enseignant admin = new Enseignant();
            admin.setName("Administrateur");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Enseignant.EnseignantRole.ADMIN);
            enseignantRepository.save(admin);
            log.info("Compte admin créé : {}", adminEmail);
            log.warn("Pensez à changer le mot de passe admin par défaut dès la première connexion.");
        }
    }
}
