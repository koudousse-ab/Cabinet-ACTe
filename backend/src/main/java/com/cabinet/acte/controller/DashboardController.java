package com.cabinet.acte.controller;

import com.cabinet.acte.dto.ChartDataDTO;
import com.cabinet.acte.dto.DashboardStatsDTO;
import com.cabinet.acte.dto.RecentActivityDTO;
import com.cabinet.acte.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/charts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChartDataDTO> getCharts() {
        return ResponseEntity.ok(dashboardService.getChartData());
    }

    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RecentActivityDTO> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }
}
