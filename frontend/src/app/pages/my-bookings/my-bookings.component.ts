import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BookingResponse,
  BookingService
} from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {

  bookings: BookingResponse[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {

    this.isLoading = true;
    this.errorMessage = '';

    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      this.errorMessage = 'Please login to view your bookings.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.bookingService.getBookings().subscribe({

      next: (data) => {

        console.log('All bookings received:', data);

        // Show only bookings belonging to the logged-in user
        this.bookings = data.filter(
          (booking) => booking.user?.id === userId
        );

        console.log('My bookings:', this.bookings);

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Failed to load bookings:', error);

        this.errorMessage =
          'Unable to load bookings. Please make sure the Spring Boot server is running.';

        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });
  }
}