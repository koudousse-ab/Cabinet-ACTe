package com.cabinet.acte.dto;

import com.cabinet.acte.entity.ErrorLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLogDTO {
    private Long id;
    private Long enseignantId;
    private String description;
    private LocalDate date;
    private LocalDateTime createdAt;

    public static ErrorLogDTO fromEntity(ErrorLog errorLog) {
        return new ErrorLogDTO(
            errorLog.getId(),
            errorLog.getEnseignantId(),
            errorLog.getDescription(),
            errorLog.getDate(),
            errorLog.getCreatedAt()
        );
    }

    public ErrorLog toEntity() {
        ErrorLog errorLog = new ErrorLog();
        errorLog.setId(this.id);
        errorLog.setEnseignantId(this.enseignantId);
        errorLog.setDescription(this.description);
        errorLog.setDate(this.date);
        return errorLog;
    }
}
