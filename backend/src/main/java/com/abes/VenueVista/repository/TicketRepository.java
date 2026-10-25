package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Event;
import com.abes.VenueVista.entity.Seat;
import com.abes.VenueVista.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByEventAndSeat(Event event, Seat seat);

    long countByEvent(Event event);
}