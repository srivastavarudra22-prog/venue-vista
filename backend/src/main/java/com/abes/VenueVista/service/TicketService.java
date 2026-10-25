package com.abes.VenueVista.service;

import com.abes.VenueVista.dto.TicketRequest;
import com.abes.VenueVista.entity.Event;
import com.abes.VenueVista.entity.Seat;
import com.abes.VenueVista.entity.Ticket;
import com.abes.VenueVista.entity.User;
import com.abes.VenueVista.repository.EventRepository;
import com.abes.VenueVista.repository.SeatRepository;
import com.abes.VenueVista.repository.TicketRepository;
import com.abes.VenueVista.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            SeatRepository seatRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

    public Ticket createTicket(TicketRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));

        // Check whether the seat is already unavailable
        if (Boolean.FALSE.equals(seat.getAvailable())) {
            throw new RuntimeException(
                    "This seat is already booked"
            );
        }

        // Check whether this event + seat combination already has a ticket
        if (ticketRepository.existsByEventAndSeat(event, seat)) {
            throw new RuntimeException(
                    "This seat is already booked for this event"
            );
        }

        // Use the event's actual ticket price
        Ticket ticket = new Ticket();

        ticket.setUser(user);
        ticket.setEvent(event);
        ticket.setSeat(seat);
        ticket.setTicketNumber(request.getTicketNumber());
        ticket.setPrice(event.getTicketPrice());
        ticket.setStatus(request.getStatus());

        // Mark the selected seat unavailable
        seat.setAvailable(false);
        seatRepository.save(seat);

        Ticket savedTicket = ticketRepository.save(ticket);

        // Check whether all event seats are now sold
        long soldTickets = ticketRepository.countByEvent(event);

        if (soldTickets >= event.getTotalSeats()) {
            event.setAvailable(false);
            eventRepository.save(event);
        } else {
            event.setAvailable(true);
            eventRepository.save(event);
        }

        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));
    }
}