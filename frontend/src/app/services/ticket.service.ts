import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketRequest {
  userId: number;
  eventId: number;
  seatId: number;
  ticketNumber: string;
  price: number;
  status: string;
}

export interface TicketResponse {
  id: number;
  ticketNumber: string;
  price: number;
  status: string;

  user?: {
    id: number;
    name: string;
    email: string;
  };

  event?: {
    id: number;
    name: string;
    eventDate: string;
    eventTime: string;
  };

  seat?: {
    id: number;
    seatNumber: string;
    seatType: string;
    rowName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  createTicket(ticket: TicketRequest): Observable<TicketResponse> {
    return this.http.post<TicketResponse>(
      this.apiUrl,
      ticket
    );
  }

  getTickets(): Observable<TicketResponse[]> {
    return this.http.get<TicketResponse[]>(
      this.apiUrl
    );
  }

  getTicketById(id: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}