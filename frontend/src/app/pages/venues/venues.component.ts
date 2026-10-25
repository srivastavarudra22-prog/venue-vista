import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Venue, VenueService } from '../../services/venue.service';
import {
  BookingRequest,
  BookingService
} from '../../services/booking.service';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit {

  venues: Venue[] = [];

  isLoading = false;
  errorMessage = '';

  selectedVenue: Venue | null = null;

  selectedDate = '';
  numberOfGuests = 1;

  isBooking = false;
  bookingMessage = '';

  today = new Date().toISOString().split('T')[0];

  constructor(
    private venueService: VenueService,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVenues();
  }

  loadVenues(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.venueService.getVenues().subscribe({

      next: (data) => {

        console.log('Venues received:', data);

        this.venues = data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Failed to load venues:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to load venues. Please make sure Spring Boot is running.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

  openBooking(venue: Venue): void {

    console.log('Book Venue clicked:', venue);

    this.selectedVenue = venue;

    this.selectedDate = '';
    this.numberOfGuests = 1;

    this.errorMessage = '';
    this.bookingMessage = '';

    this.cdr.detectChanges();

    setTimeout(() => {

      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });

    }, 100);
  }

  closeBooking(): void {

    this.selectedVenue = null;

    this.selectedDate = '';
    this.numberOfGuests = 1;

    this.errorMessage = '';
    this.bookingMessage = '';

    this.cdr.detectChanges();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  confirmVenueBooking(): void {

    if (!this.selectedVenue) {
      return;
    }

    const userId = Number(
      localStorage.getItem('userId')
    );

    if (!userId) {

      this.errorMessage =
        'Please login before booking a venue.';

      return;
    }

    if (!this.selectedDate) {

      this.errorMessage =
        'Please select a booking date.';

      return;
    }

    if (this.selectedDate < this.today) {

      this.errorMessage =
        'Booking date cannot be in the past.';

      return;
    }

    if (this.numberOfGuests < 1) {

      this.errorMessage =
        'Number of guests must be at least 1.';

      return;
    }

    if (
      this.selectedVenue.capacity &&
      this.numberOfGuests > this.selectedVenue.capacity
    ) {

      this.errorMessage =
        `Number of guests cannot exceed the venue capacity of ${this.selectedVenue.capacity}.`;

      return;
    }

    this.isBooking = true;

    this.errorMessage = '';
    this.bookingMessage = '';

    const booking: BookingRequest = {

      userId: userId,

      venueId: this.selectedVenue.id,

      bookingDate: this.today,

      eventDate: this.selectedDate,

      numberOfGuests: this.numberOfGuests,

      totalAmount: this.selectedVenue.pricePerDay,

      status: 'PENDING',

      // false = venue booking
      eventBooking: false
    };

    console.log(
      'Venue booking request:',
      booking
    );

    this.bookingService.createBooking(booking).subscribe({

      next: (response) => {

        console.log(
          'Venue booking request submitted:',
          response
        );

        this.isBooking = false;
        this.bookingMessage =
          'Booking request submitted! Waiting for host approval.';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 1200);
      },

      error: (error) => {

        console.error(
          'Venue booking failed:',
          error
        );

        if (error?.error?.eventDate) {

          this.errorMessage =
            error.error.eventDate;

        } else if (error?.error?.message) {

          this.errorMessage =
            error.error.message;

        } else {

          this.errorMessage =
            'Venue booking failed. Please try another date.';
        }

        this.isBooking = false;

        this.cdr.detectChanges();
      }

    });
  }
}