import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  PaymentRequest,
  PaymentService
} from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  bookingId = 0;
  amount = 0;

  paymentMethod = '';

  isPaying = false;
  paymentSuccess = false;

  message = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('bookingId');
    const amount = this.route.snapshot.queryParamMap.get('amount');

    if (!id) {
      this.errorMessage = 'Booking information not found.';
      return;
    }

    this.bookingId = Number(id);
    this.amount = Number(amount || 0);

    if (!this.bookingId) {
      this.errorMessage = 'Invalid booking ID.';
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Invalid payment amount.';
    }
  }

  makePayment(): void {

    if (!this.bookingId) {
      this.errorMessage = 'Invalid booking ID.';
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Invalid payment amount.';
      return;
    }

    if (!this.paymentMethod) {
      this.errorMessage =
        'Please select a payment method.';
      return;
    }

    this.isPaying = true;
    this.message = '';
    this.errorMessage = '';

    /*
     * Backend expects LocalDateTime.
     *
     * Example:
     * 2026-09-30T22:15:30
     *
     * We remove the final "Z" from ISO string because
     * the backend expects LocalDateTime, not OffsetDateTime.
     */
    const paymentDate =
      new Date().toISOString().slice(0, 19);

    const payment: PaymentRequest = {

      bookingId: this.bookingId,

      amount: this.amount,

      paymentMethod: this.paymentMethod,

      paymentStatus: 'SUCCESS',

      paymentDate: paymentDate
    };

    console.log('Payment request:', payment);

    this.paymentService.createPayment(payment).subscribe({

      next: (response) => {

        console.log(
          'Payment successful:',
          response
        );

        this.message =
          `Payment successful! Payment ID: ${response.id}`;

        this.paymentSuccess = true;
        this.isPaying = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Payment failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Payment failed. Please try again.';

        this.isPaying = false;

        this.cdr.detectChanges();
      }
    });
  }

  goToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goToTickets(): void {
    this.router.navigate(['/tickets']);
  }
}