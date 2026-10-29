package com.abes.VenueVista.config;

import com.abes.VenueVista.entity.Booking;
import com.abes.VenueVista.entity.Event;
import com.abes.VenueVista.entity.User;
import com.abes.VenueVista.entity.Venue;
import com.abes.VenueVista.repository.BookingRepository;
import com.abes.VenueVista.repository.EventRepository;
import com.abes.VenueVista.repository.UserRepository;
import com.abes.VenueVista.repository.VenueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(
            VenueRepository venueRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            BookingRepository bookingRepository
    ) {
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {
        User demoUser = userRepository.findFirstByEmailOrderByIdAsc("demo@example.com").orElse(null);
        if (demoUser == null) {
            demoUser = new User();
            demoUser.setName("Demo User");
            demoUser.setEmail("demo@example.com");
            demoUser.setPassword(passwordEncoder.encode("password123"));
            demoUser.setPhone("9876543210");
            demoUser.setRole("CUSTOMER");
            demoUser = userRepository.save(demoUser);
        }

        if (userRepository.findFirstByEmailOrderByIdAsc("provider@example.com").isEmpty()) {
            User providerUser = new User();
            providerUser.setName("Royal Events Provider");
            providerUser.setEmail("provider@example.com");
            providerUser.setPassword(passwordEncoder.encode("provider123"));
            providerUser.setPhone("9876543212");
            providerUser.setRole("PROVIDER");
            userRepository.save(providerUser);
        }

        if (userRepository.findFirstByEmailOrderByIdAsc("admin@example.com").isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setPhone("9876543211");
            adminUser.setRole("ADMIN");
            userRepository.save(adminUser);
        }

        // Check if Rudra Srivastava accounts exist
        java.util.List<User> rudraUsers = userRepository.findAllByEmailOrderByIdAsc("srivastavarudra22@gmail.com");
        if (!rudraUsers.isEmpty()) {
            System.out.println("VenueVista found " + rudraUsers.size() + " account(s) for srivastavarudra22@gmail.com");
        }

        if (venueRepository.count() == 0) {
            Venue venue1 = new Venue();
            venue1.setName("The Grand Palace");
            venue1.setLocation("Ghaziabad");
            venue1.setDescription("A luxurious venue suitable for weddings, receptions, and mega corporate events.");
            venue1.setCategory("Wedding Hall");
            venue1.setCapacity(600);
            venue1.setPricePerDay(55000.0);
            venue1.setImageUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80");
            venue1.setAvailable(true);
            venueRepository.save(venue1);

            Venue venue2 = new Venue();
            venue2.setName("Skyline Convention Center");
            venue2.setLocation("Noida");
            venue2.setDescription("Modern high-tech auditorium & conference halls equipped with advanced audio-visual systems.");
            venue2.setCategory("Conference Center");
            venue2.setCapacity(350);
            venue2.setPricePerDay(35000.0);
            venue2.setImageUrl("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80");
            venue2.setAvailable(true);
            venueRepository.save(venue2);

            Venue venue3 = new Venue();
            venue3.setName("Emerald Garden & Resort");
            venue3.setLocation("Delhi NCR");
            venue3.setDescription("Sprawling open-air lush green lawns perfect for social gatherings, music festivals, and parties.");
            venue3.setCategory("Open Lawn");
            venue3.setCapacity(1000);
            venue3.setPricePerDay(75000.0);
            venue3.setImageUrl("https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80");
            venue3.setAvailable(true);
            venueRepository.save(venue3);

            if (eventRepository.count() == 0) {
                Event event1 = new Event();
                event1.setName("Tech Innovators Summit 2026");
                event1.setDescription("Annual gathering of industry leaders, developers, and tech entrepreneurs.");
                event1.setVenue(venue2);
                event1.setEventDate(LocalDate.now().plusDays(15));
                event1.setEventTime(LocalTime.of(10, 0));
                event1.setCategory("Technology");
                event1.setTicketPrice(499.0);
                event1.setTotalSeats(300);
                event1.setAvailable(true);
                eventRepository.save(event1);

                Event event2 = new Event();
                event2.setName("Acoustic Music Night");
                event2.setDescription("An evening of soul-stirring live acoustic performances under the stars.");
                event2.setVenue(venue3);
                event2.setEventDate(LocalDate.now().plusDays(20));
                event2.setEventTime(LocalTime.of(18, 30));
                event2.setCategory("Music");
                event2.setTicketPrice(299.0);
                event2.setTotalSeats(500);
                event2.setAvailable(true);
                eventRepository.save(event2);
            }

            if (bookingRepository.count() == 0 && demoUser != null) {
                Booking booking = new Booking();
                booking.setUser(demoUser);
                booking.setVenue(venue1);
                booking.setBookingDate(LocalDate.now());
                booking.setEventDate(LocalDate.now().plusDays(10));
                booking.setNumberOfGuests(250);
                booking.setTotalAmount(55000.0);
                booking.setStatus("PENDING");
                bookingRepository.save(booking);

                Booking booking2 = new Booking();
                booking2.setUser(demoUser);
                booking2.setVenue(venue2);
                booking2.setBookingDate(LocalDate.now().minusDays(2));
                booking2.setEventDate(LocalDate.now().plusDays(5));
                booking2.setNumberOfGuests(120);
                booking2.setTotalAmount(35000.0);
                booking2.setStatus("CONFIRMED");
                bookingRepository.save(booking2);
            }
        }
    }
}
