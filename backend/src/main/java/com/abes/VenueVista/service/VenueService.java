package com.abes.VenueVista.service;

import com.abes.VenueVista.entity.Venue;
import com.abes.VenueVista.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    // Add a new venue
    public Venue addVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    // Get all venues
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    // Get venue by ID
    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
    }

    // Find venues by location
    public List<Venue> getVenuesByLocation(String location) {
        return venueRepository.findByLocation(location);
    }

    // Find venues by category
    public List<Venue> getVenuesByCategory(String category) {
        return venueRepository.findByCategory(category);
    }

    // Get available venues
    public List<Venue> getAvailableVenues() {
        return venueRepository.findByAvailableTrue();
    }

    // Delete venue
    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }
}
