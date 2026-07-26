package com.cabinet.acte.service;

import com.cabinet.acte.dto.EnseignantDTO;
import com.cabinet.acte.dto.ErrorLogDTO;
import com.cabinet.acte.dto.TaskDTO;

import java.util.List;

public interface EnseignantService {

    EnseignantDTO createEnseignant(EnseignantDTO enseignantDTO);

    EnseignantDTO getEnseignantById(Long id);

    EnseignantDTO updateEnseignant(Long id, EnseignantDTO enseignantDTO);

    void deleteEnseignant(Long id);

    List<EnseignantDTO> getAllEnseignants();

    List<EnseignantDTO> searchEnseignants(String query);

    List<TaskDTO> getEnseignantTasks(Long id);

    List<ErrorLogDTO> getEnseignantErrors(Long id);

    ErrorLogDTO addError(ErrorLogDTO errorLogDTO);
}
