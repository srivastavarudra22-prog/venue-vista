package com.abes.VenueVista.controller;

import com.abes.VenueVista.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/sales")
    public Map<String, Object> getSalesSummary() {
        return analyticsService.getSalesSummary();
    }
}
