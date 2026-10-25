import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seat {
  id: number;
  seatNumber: string;
  seatType: string;
  rowName: string;
  available: boolean;

  venue?: {
    id: number;
    name: string;
    location: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private apiUrl = 'http://localhost:8080/api/seats';

  constructor(private http: HttpClient) {}

  getSeats(): Observable<Seat[]> {
    return this.http.get<Seat[]>(this.apiUrl);
  }

  getSeatById(id: number): Observable<Seat> {
    return this.http.get<Seat>(
      `${this.apiUrl}/${id}`
    );
  }
}