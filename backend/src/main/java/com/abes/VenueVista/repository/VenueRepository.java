package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {

    List<Venue> findByLocation(String location);

    List<Venue> findByCategory(String category);

    List<Venue> findByAvailableTrue();
}
