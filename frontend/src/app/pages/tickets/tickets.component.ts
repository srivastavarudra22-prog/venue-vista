import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TicketResponse,
  TicketService
} from '../../services/ticket.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {

  tickets: TicketResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const userId = Number(localStorage.getItem('userId'));

    if (!userId) {
      this.errorMessage = 'Please login to view your tickets.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.ticketService.getTickets().subscribe({
      next: (data) => {
        console.log('All tickets received:', data);

        this.tickets = data.filter(
          ticket => ticket.user?.id === userId
        );

        console.log('My tickets:', this.tickets);

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load tickets:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to load tickets. Please make sure the Spring Boot server is running.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}