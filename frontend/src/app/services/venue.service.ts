import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venue {
  id: number;
  name: string;
  location: string;
  description: string;
  category: string;
  capacity: number;
  pricePerDay: number;
  imageUrl: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  private apiUrl = 'http://localhost:8080/api/venues';

  constructor(private http: HttpClient) {}

  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.apiUrl);
  }

  getVenueById(id: number): Observable<Venue> {
    return this.http.get<Venue>(`${this.apiUrl}/${id}`);
  }

  createVenue(venue: Partial<Venue>): Observable<Venue> {
    return this.http.post<Venue>(this.apiUrl, venue);
  }

  deleteVenue(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}