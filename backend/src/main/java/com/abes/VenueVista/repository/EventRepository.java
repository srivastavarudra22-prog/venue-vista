package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
