package com.cabinet.acte.service.impl;

import com.cabinet.acte.dto.EnseignantDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.entity.ErrorLog;
import com.cabinet.acte.repository.EnseignantRepository;
import com.cabinet.acte.repository.ErrorLogRepository;
import com.cabinet.acte.service.EnseignantService;
import com.cabinet.acte.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnseignantServiceImpl implements EnseignantService {

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ErrorLogRepository errorLogRepository;

    @Autowired
    private TaskService taskService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public EnseignantDTO createEnseignant(EnseignantDTO enseignantDTO) {
        Enseignant enseignant = enseignantDTO.toEntity();
        if (enseignantDTO.getPassword() != null && !enseignantDTO.getPassword().isEmpty()) {
            enseignant.setPassword(passwordEncoder.encode(enseignantDTO.getPassword()));
        }
        Enseignant saved = enseignantRepository.save(enseignant);
        return EnseignantDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EnseignantDTO getEnseignantById(Long id) {
        return enseignantRepository.findById(id)
            .map(EnseignantDTO::fromEntity)
            .orElseThrow(() -> new RuntimeException("Enseignant not found with id: " + id));
    }

    @Override
    public EnseignantDTO updateEnseignant(Long id, EnseignantDTO enseignantDTO) {
        Enseignant enseignant = enseignantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Enseignant not found with id: " + id));

        enseignant.setName(enseignantDTO.getName());
        enseignant.setEmail(enseignantDTO.getEmail());
        enseignant.setRole(enseignantDTO.getRole());

        if (enseignantDTO.getPassword() != null && !enseignantDTO.getPassword().isEmpty()) {
            enseignant.setPassword(passwordEncoder.encode(enseignantDTO.getPassword()));
        }

        Enseignant updated = enseignantRepository.save(enseignant);
        return EnseignantDTO.fromEntity(updated);
    }

    @Override
    public void deleteEnseignant(Long id) {
        if (!enseignantRepository.existsById(id)) {
            throw new RuntimeException("Enseignant not found with id: " + id);
        }
        enseignantRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantDTO> getAllEnseignants() {
        return enseignantRepository.findAll().stream()
            .map(EnseignantDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnseignantDTO> searchEnseignants(String query) {
        return enseignantRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
            .map(EnseignantDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getEnseignantTasks(Long id) {
        return taskService.getTasksByAssignedTo(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ErrorLogDTO> getEnseignantErrors(Long id) {
        return errorLogRepository.findByEnseignantId(id).stream()
            .map(ErrorLogDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Override
    public ErrorLogDTO addError(ErrorLogDTO errorLogDTO) {
        ErrorLog errorLog = errorLogDTO.toEntity();
        ErrorLog saved = errorLogRepository.save(errorLog);
        return ErrorLogDTO.fromEntity(saved);
    }
}
