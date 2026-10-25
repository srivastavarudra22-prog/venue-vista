import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface PaymentResponse {
  id: number;
  booking: any;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(
    payment: PaymentRequest
  ): Observable<PaymentResponse> {

    return this.http.post<PaymentResponse>(
      this.apiUrl,
      payment
    );
  }

  getPayments(): Observable<PaymentResponse[]> {

    return this.http.get<PaymentResponse[]>(
      this.apiUrl
    );
  }

  getPaymentById(
    id: number
  ): Observable<PaymentResponse> {

    return this.http.get<PaymentResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}