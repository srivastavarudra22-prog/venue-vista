package com.abes.VenueVista.service;

import com.abes.VenueVista.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public Map<String, Object> getSalesSummary() {

        long totalTicketsSold =
                analyticsRepository.getTotalTicketsSold();

        Double totalRevenue =
                analyticsRepository.getTotalRevenue();

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalTicketsSold", totalTicketsSold);
        summary.put("totalRevenue", totalRevenue);

        return summary;
    }
}
