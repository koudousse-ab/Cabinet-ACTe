package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Etudiant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class EtudiantDTO {
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String classe;
    private LocalDateTime createdAt;
    private String password;

    public EtudiantDTO() {}

    public EtudiantDTO(Long id, String name, String email, String classe, LocalDateTime createdAt, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.classe = classe;
        this.createdAt = createdAt;
        this.password = password;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getClasse() { return classe; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPassword() { return password; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setClasse(String classe) { this.classe = classe; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setPassword(String password) { this.password = password; }

    public static EtudiantDTO fromEntity(Etudiant etudiant) {
        return new EtudiantDTO(
            etudiant.getId(),
            etudiant.getName(),
            etudiant.getEmail(),
            etudiant.getClasse(),
            etudiant.getCreatedAt(),
            null
        );
    }

    public Etudiant toEntity() {
        Etudiant etudiant = new Etudiant();
        etudiant.setId(this.id);
        etudiant.setName(this.name);
        etudiant.setEmail(this.email);
        etudiant.setClasse(this.classe);
        etudiant.setPassword(this.password);
        return etudiant;
    }
}
