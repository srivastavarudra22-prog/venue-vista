package com.abes.VenueVista.service;

import com.abes.VenueVista.dto.BookingRequest;
import com.abes.VenueVista.entity.Booking;
import com.abes.VenueVista.entity.User;
import com.abes.VenueVista.entity.Venue;
import com.abes.VenueVista.repository.BookingRepository;
import com.abes.VenueVista.repository.UserRepository;
import com.abes.VenueVista.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            VenueRepository venueRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
    }

    public Booking createBooking(BookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new RuntimeException("Venue not found"));

        if (request.getNumberOfGuests() == null ||
                request.getNumberOfGuests() <= 0) {

            throw new RuntimeException(
                    "Number of guests must be greater than 0"
            );
        }

        if (venue.getCapacity() != null &&
                request.getNumberOfGuests() > venue.getCapacity()) {

            throw new RuntimeException(
                    "Number of guests cannot exceed venue capacity"
            );
        }

        if (Boolean.FALSE.equals(venue.getAvailable())) {

            throw new RuntimeException(
                    "Venue is not available"
            );
        }

        if (request.getEventDate() == null) {

            throw new RuntimeException(
                    "Date is required"
            );
        }

        /*
         * Only VENUE bookings should check:
         * same venue + same date.
         *
         * Event bookings are allowed on the same date
         * because event seats are handled separately.
         */
        if (!request.isEventBooking()) {

            boolean alreadyBooked =
                    bookingRepository.existsByVenueAndEventDateAndStatusIn(
                            venue,
                            request.getEventDate(),
                            java.util.List.of("CONFIRMED", "PENDING")
                    );

            if (alreadyBooked) {

                throw new RuntimeException(
                        "Venue is already booked or has a pending reservation for this date"
                );
            }
        }

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setVenue(venue);
        booking.setBookingDate(request.getBookingDate());
        booking.setEventDate(request.getEventDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(request.getStatus());

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    public Booking updateBookingStatus(Long id, String status, String rejectionReason) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        if (rejectionReason != null) {
            booking.setRejectionReason(rejectionReason);
        }
        return bookingRepository.save(booking);
    }
}