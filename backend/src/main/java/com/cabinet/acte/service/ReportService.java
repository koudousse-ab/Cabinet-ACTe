package com.cabinet.acte.service;

import com.cabinet.acte.dto.TaskDTO;
import com.cabinet.acte.entity.Enseignant;
import com.cabinet.acte.entity.Project;
import com.cabinet.acte.repository.EnseignantRepository;
import com.cabinet.acte.repository.ProjectRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private EnseignantRepository enseignantRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public byte[] generateTasksPDF(List<TaskDTO> tasks) throws DocumentException {
        // Récupérer les noms pour éviter les appels en boucle
        Map<Long, String> enseignantNames = enseignantRepository.findAll().stream()
                .collect(Collectors.toMap(Enseignant::getId, Enseignant::getName));
        Map<Long, String> projectNames = projectRepository.findAll().stream()
                .collect(Collectors.toMap(Project::getId, Project::getName));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, out);
        document.open();

        // Titre
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Rapport des tâches", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" "));

        // Date de génération
        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
        Paragraph datePara = new Paragraph("Généré le " + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), dateFont);
        datePara.setAlignment(Paragraph.ALIGN_RIGHT);
        document.add(datePara);

        document.add(new Paragraph(" "));

        // Tableau
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(10);

        // En-têtes
        String[] headers = {"Titre", "Assigné à", "Statut", "Priorité", "Date limite", "Projet"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            table.addCell(cell);
        }

        // Données
        for (TaskDTO task : tasks) {
            table.addCell(task.getTitle() != null ? task.getTitle() : "");
            String assignee = task.getAssignedTo() != null ? enseignantNames.getOrDefault(task.getAssignedTo(), "Inconnu") : "Non assigné";
            table.addCell(assignee);
            table.addCell(task.getStatus() != null ? task.getStatus().toString() : "");
            table.addCell(task.getPriority() != null ? task.getPriority().toString() : "");
            table.addCell(task.getDueDate() != null ? task.getDueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "");
            String project = task.getProjectId() != null ? projectNames.getOrDefault(task.getProjectId(), "Inconnu") : "";
            table.addCell(project);
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }
}
