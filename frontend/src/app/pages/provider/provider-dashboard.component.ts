import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingResponse, BookingService } from '../../services/booking.service';
import { Venue, VenueService } from '../../services/venue.service';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-dashboard.component.html',
  styleUrl: './provider-dashboard.component.css'
})
export class ProviderDashboardComponent implements OnInit {

  userName = '';
  userEmail = '';
  userRole = '';

  activeTab: 'bookings' | 'venues' = 'bookings';
  statusFilter: 'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED' = 'ALL';

  bookings: BookingResponse[] = [];
  venues: Venue[] = [];

  isLoadingBookings = false;
  isLoadingVenues = false;
  actionMessage = '';
  errorMessage = '';

  // Rejection Modal
  showRejectModal = false;
  selectedBookingToReject: BookingResponse | null = null;
  rejectionReason = '';
  isSubmittingRejection = false;

  quickReasons: string[] = [
    'Venue undergoing maintenance on requested date',
    'Date already booked offline/reserved for private function',
    'Guest count exceeds venue optimal capacity',
    'Requested dates conflict with technical renovation',
    'Cannot accommodate catering/decor requirements on this date'
  ];

  // New Venue Form
  showAddVenueModal = false;
  newVenue: Partial<Venue> = {
    name: '',
    location: '',
    category: 'Wedding Hall',
    capacity: 200,
    pricePerDay: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    description: '',
    available: true
  };
  isSubmittingVenue = false;

  constructor(
    private bookingService: BookingService,
    private venueService: VenueService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.userName = localStorage.getItem('userName') || 'Provider';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userRole = (localStorage.getItem('userRole') || 'PROVIDER').toUpperCase();
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadBookings();
    this.loadVenues();
  }

  loadBookings(): void {
    this.isLoadingBookings = true;
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        // Sort newest first
        this.bookings = (data || []).sort((a, b) => b.id - a.id);
        this.isLoadingBookings = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        this.errorMessage = 'Could not load bookings from backend.';
        this.isLoadingBookings = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadVenues(): void {
    this.isLoadingVenues = true;
    this.venueService.getVenues().subscribe({
      next: (data) => {
        this.venues = data || [];
        this.isLoadingVenues = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load venues:', err);
        this.isLoadingVenues = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredBookings(): BookingResponse[] {
    if (this.statusFilter === 'ALL') {
      return this.bookings;
    }
    if (this.statusFilter === 'REJECTED') {
      return this.bookings.filter(b => {
        const s = (b.status || '').toUpperCase();
        return s === 'REJECTED' || s === 'CANCELLED';
      });
    }
    return this.bookings.filter(b => (b.status || '').toUpperCase() === this.statusFilter);
  }

  get pendingBookings(): BookingResponse[] {
    return this.bookings.filter(b => (b.status || '').toUpperCase() === 'PENDING');
  }

  // KPI Calculations
  get totalRevenue(): number {
    return this.bookings
      .filter(b => (b.status || '').toUpperCase() === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  }

  get pendingCount(): number {
    return this.pendingBookings.length;
  }

  get confirmedCount(): number {
    return this.bookings.filter(b => (b.status || '').toUpperCase() === 'CONFIRMED').length;
  }

  get rejectedCount(): number {
    return this.bookings.filter(b => {
      const s = (b.status || '').toUpperCase();
      return s === 'REJECTED' || s === 'CANCELLED';
    }).length;
  }

  // Approve action
  approveBooking(booking: BookingResponse): void {
    const oldStatus = booking.status;
    booking.status = 'CONFIRMED';

    this.bookingService.updateBookingStatus(booking.id, 'CONFIRMED').subscribe({
      next: (updated) => {
        this.actionMessage = `✓ Booking #${booking.id} has been Approved successfully!`;
        booking.status = updated.status;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        booking.status = oldStatus;
        this.errorMessage = `Failed to approve booking: ${err?.message || 'Server error'}`;
        this.cdr.detectChanges();
      }
    });
  }

  // Open Rejection Dialog
  openRejectModal(booking: BookingResponse): void {
    this.selectedBookingToReject = booking;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedBookingToReject = null;
    this.rejectionReason = '';
  }

  setQuickReason(reason: string): void {
    this.rejectionReason = reason;
  }

  confirmRejection(): void {
    if (!this.selectedBookingToReject) return;

    if (!this.rejectionReason.trim()) {
      alert('Please enter or select a rejection reason so the customer can see why their booking was not accepted.');
      return;
    }

    this.isSubmittingRejection = true;
    const booking = this.selectedBookingToReject;

    this.bookingService.updateBookingStatus(booking.id, 'REJECTED', this.rejectionReason.trim()).subscribe({
      next: (updated) => {
        booking.status = updated.status;
        booking.rejectionReason = updated.rejectionReason || this.rejectionReason.trim();

        this.actionMessage = `✕ Booking #${booking.id} was Rejected. The reason will be shown to the customer.`;
        this.isSubmittingRejection = false;
        this.closeRejectModal();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.errorMessage = `Failed to reject booking: ${err?.message || 'Server error'}`;
        this.isSubmittingRejection = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddVenueModal(): void {
    this.showAddVenueModal = true;
  }

  closeAddVenueModal(): void {
    this.showAddVenueModal = false;
  }

  createVenue(): void {
    if (!this.newVenue.name || !this.newVenue.location) {
      alert('Please fill in Venue Name and Location.');
      return;
    }

    this.isSubmittingVenue = true;
    this.venueService.createVenue(this.newVenue).subscribe({
      next: (created) => {
        this.actionMessage = `Venue "${created.name}" created successfully!`;
        this.venues.unshift(created);
        this.isSubmittingVenue = false;
        this.showAddVenueModal = false;
        // reset form
        this.newVenue = {
          name: '',
          location: '',
          category: 'Wedding Hall',
          capacity: 200,
          pricePerDay: 25000,
          imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
          description: '',
          available: true
        };
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3500);
      },
      error: (err) => {
        alert('Failed to create venue: ' + (err?.error?.message || err.message));
        this.isSubmittingVenue = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteVenue(venue: Venue): void {
    if (!confirm(`Are you sure you want to delete venue "${venue.name}"?`)) {
      return;
    }

    this.venueService.deleteVenue(venue.id).subscribe({
      next: () => {
        this.venues = this.venues.filter(v => v.id !== venue.id);
        this.actionMessage = `Venue "${venue.name}" removed successfully.`;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.actionMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        alert('Could not delete venue: ' + err.message);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    this.router.navigate(['/provider/login']);
  }
}
