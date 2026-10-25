package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
}
