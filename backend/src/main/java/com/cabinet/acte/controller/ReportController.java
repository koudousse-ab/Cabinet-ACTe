package com.cabinet.acte.controller;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.service.ReportService;
import com.cabinet.acte.service.TaskService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ReportService reportService;

    @GetMapping("/tasks/pdf")
    public ResponseEntity<byte[]> exportTasksPDF(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long projectId,
            Authentication authentication) {
        try {
            List<TaskDTO> tasks = taskService.getFilteredTasks(status, priority, projectId, authentication);
            byte[] pdfBytes = reportService.generateTasksPDF(tasks);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "rapport_taches.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
