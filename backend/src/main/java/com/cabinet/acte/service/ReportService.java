package com.cabinet.acte.service;

import com.cabinet.acte.dto.WeeklyReportDTO;

import java.time.LocalDate;

public interface ReportService {

    WeeklyReportDTO getWeeklyReport(LocalDate weekStart);

    byte[] exportWeeklyReportPdf(LocalDate weekStart, Long employeeId);
}
