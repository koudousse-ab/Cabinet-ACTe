package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Enseignant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class EnseignantDTO {
    private Long id;
    private String name;
    private String email;
    private Enseignant.EnseignantRole role;
    private LocalDateTime createdAt;
    private String password;

    public EnseignantDTO() {}
    public EnseignantDTO(Long id, String name, String email, Enseignant.EnseignantRole role, LocalDateTime createdAt, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.password = password;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Enseignant.EnseignantRole getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getPassword() { return password; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Enseignant.EnseignantRole role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setPassword(String password) { this.password = password; }

    public static EnseignantDTO fromEntity(Enseignant enseignant) {
        return new EnseignantDTO(
            enseignant.getId(),
            enseignant.getName(),
            enseignant.getEmail(),
            enseignant.getRole(),
            enseignant.getCreatedAt(),
            null
        );
    }

    public Enseignant toEntity() {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(this.id);
        enseignant.setName(this.name);
        enseignant.setEmail(this.email);
        enseignant.setRole(this.role);
        enseignant.setPassword(this.password);
        return enseignant;
    }
}
