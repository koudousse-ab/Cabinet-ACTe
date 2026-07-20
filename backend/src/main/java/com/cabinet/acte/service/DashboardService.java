package com.cabinet.acte.service;

import com.cabinet.acte.dto.ChartDataDTO;
import com.cabinet.acte.dto.DashboardStatsDTO;
import com.cabinet.acte.dto.RecentActivityDTO;

public interface DashboardService {
    DashboardStatsDTO getStats();
    ChartDataDTO getChartData();
    RecentActivityDTO getRecentActivity();
}
