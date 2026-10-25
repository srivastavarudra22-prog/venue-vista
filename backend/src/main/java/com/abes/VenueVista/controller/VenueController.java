package com.abes.VenueVista.controller;

import com.abes.VenueVista.entity.Venue;
import com.abes.VenueVista.service.VenueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    // Add a new venue
    @PostMapping
    public Venue addVenue(@RequestBody Venue venue) {
        return venueService.addVenue(venue);
    }

    // Get all venues
    @GetMapping
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    // Get venue by ID
    @GetMapping("/{id}")
    public Venue getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id);
    }

    // Get venues by location
    @GetMapping("/location/{location}")
    public List<Venue> getVenuesByLocation(@PathVariable String location) {
        return venueService.getVenuesByLocation(location);
    }

    // Get venues by category
    @GetMapping("/category/{category}")
    public List<Venue> getVenuesByCategory(@PathVariable String category) {
        return venueService.getVenuesByCategory(category);
    }

    // Get available venues
    @GetMapping("/available")
    public List<Venue> getAvailableVenues() {
        return venueService.getAvailableVenues();
    }

    // Delete venue
    @DeleteMapping("/{id}")
    public String deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return "Venue deleted successfully";
    }
}
