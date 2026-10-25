import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Event, EventService } from '../../services/event.service';
import { Seat, SeatService } from '../../services/seat.service';

import {
  BookingRequest,
  BookingService
} from '../../services/booking.service';

import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  eventId = 0;

  event: Event | null = null;

  seats: Seat[] = [];
  selectedSeat: Seat | null = null;

  numberOfGuests = 1;
  totalAmount = 0;

  isLoading = false;
  isLoadingSeats = false;
  isBooking = false;

  message = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Event not found.';
      return;
    }

    this.eventId = Number(id);

    this.loadEvent();
  }

  loadEvent(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEventById(this.eventId).subscribe({

      next: (data) => {

        console.log('Event received:', data);

        this.event = data;

        this.calculateTotal();

        this.isLoading = false;

        this.loadSeats();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Failed to load event:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to load event details. Please try again.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  loadSeats(): void {

    if (!this.event?.venue?.id) {

      this.errorMessage =
        'Venue information is not available.';

      return;
    }

    this.isLoadingSeats = true;

    this.seatService.getSeats().subscribe({

      next: (data) => {

        console.log('All seats received:', data);

        this.seats = data.filter(
          seat =>
            seat.venue?.id === this.event?.venue?.id &&
            seat.available !== false
        );

        console.log('Available seats:', this.seats);

        this.isLoadingSeats = false;

        if (this.seats.length === 0) {

          this.errorMessage =
            'This event is fully booked. No seats are currently available.';

        } else {

          this.errorMessage = '';

        }

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Failed to load seats:', error);

        this.errorMessage =
          'Unable to load seats. Please try again.';

        this.isLoadingSeats = false;

        this.cdr.detectChanges();
      }
    });
  }

  selectSeat(seat: Seat): void {

    this.selectedSeat = seat;

    this.errorMessage = '';

    this.cdr.detectChanges();
  }

  calculateTotal(): void {

    if (!this.event) {
      this.totalAmount = 0;
      return;
    }

    this.totalAmount =
      this.event.ticketPrice * this.numberOfGuests;
  }

  confirmBooking(): void {

    if (!this.event) {
      return;
    }

    if (this.seats.length === 0) {

      this.errorMessage =
        'This event is fully booked.';

      return;
    }

    const userId = Number(
      localStorage.getItem('userId')
    );

    if (!userId) {

      this.errorMessage =
        'Please login before making the booking.';

      return;
    }

    if (!this.selectedSeat) {

      this.errorMessage =
        'Please select a seat before confirming the booking.';

      return;
    }

    this.message = '';
    this.errorMessage = '';
    this.isBooking = true;

    const booking: BookingRequest = {

      userId: userId,

      venueId: this.event.venue.id,

      bookingDate:
        new Date().toISOString().split('T')[0],

      eventDate: this.event.eventDate,

      numberOfGuests: 1,

      totalAmount: this.event.ticketPrice,

      status: 'CONFIRMED',

      eventBooking: true
    };

    console.log(
      'Sending event booking:',
      booking
    );

    // Step 1: Create booking
    this.bookingService.createBooking(booking).subscribe({

      next: (bookingResponse) => {

        console.log(
          'Booking created:',
          bookingResponse
        );

        const ticketNumber =
          'TKT-' + Date.now();

        const ticketData = {

          userId: userId,

          eventId: this.eventId,

          seatId: this.selectedSeat!.id,

          ticketNumber: ticketNumber,

          price: this.event!.ticketPrice,

          status: 'CONFIRMED'
        };

        // Step 2: Create ticket
        this.ticketService.createTicket(ticketData).subscribe({

          next: (ticketResponse) => {

            console.log(
              'Ticket created:',
              ticketResponse
            );

            this.isBooking = false;

            /*
             * Booking and ticket are successfully created.
             * Now open the mock payment page.
             */
            this.router.navigate(
              ['/payment', bookingResponse.id],
              {
                queryParams: {
                  amount: this.event!.ticketPrice
                }
              }
            );
          },

          error: (ticketError) => {

            console.error(
              'Ticket creation failed:',
              ticketError
            );

            this.errorMessage =
              ticketError?.error?.message ||
              'Booking was created, but ticket creation failed.';

            this.isBooking = false;

            this.cdr.detectChanges();
          }

        });
      },

      error: (bookingError) => {

        console.error(
          'Event booking failed:',
          bookingError
        );

        this.errorMessage =
          bookingError?.error?.message ||
          'Event booking failed. Please try again.';

        this.isBooking = false;

        this.cdr.detectChanges();
      }
    });
  }
}