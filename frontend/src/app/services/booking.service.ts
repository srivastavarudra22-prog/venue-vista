import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingRequest {
  userId: number;
  venueId: number;
  bookingDate: string;
  eventDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
  eventBooking: boolean;
}

export interface BookingResponse {
  id: number;
  user: any;
  venue: any;
  bookingDate: string;
  eventDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: string;
  rejectionReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(
    booking: BookingRequest
  ): Observable<BookingResponse> {

    return this.http.post<BookingResponse>(
      this.apiUrl,
      booking
    );
  }

  getBookings(): Observable<BookingResponse[]> {

    return this.http.get<BookingResponse[]>(
      this.apiUrl
    );
  }

  getBookingById(
    id: number
  ): Observable<BookingResponse> {

    return this.http.get<BookingResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  updateBookingStatus(
    id: number,
    status: string,
    rejectionReason?: string
  ): Observable<BookingResponse> {

    return this.http.put<BookingResponse>(
      `${this.apiUrl}/${id}/status`,
      { status, rejectionReason }
    );
  }
}