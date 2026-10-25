package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Booking;
import com.abes.VenueVista.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByVenueAndEventDate(Venue venue, LocalDate eventDate);

    boolean existsByVenueAndEventDateAndStatusIn(Venue venue, LocalDate eventDate, java.util.List<String> statuses);
}