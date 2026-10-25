package com.abes.VenueVista.repository;

import com.abes.VenueVista.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AnalyticsRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'CONFIRMED'")
    long getTotalTicketsSold();

    @Query("SELECT COALESCE(SUM(t.price), 0) FROM Ticket t WHERE t.status = 'CONFIRMED'")
    Double getTotalRevenue();
}
