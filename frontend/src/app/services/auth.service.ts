import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string,
    role?: string
  ): Observable<LoginResponse> {

    const loginData: LoginRequest = {
      email: email,
      password: password,
      role: role
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      loginData
    );
  }

  register(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string = 'CUSTOMER'
  ): Observable<RegisterResponse> {

    const registerData: RegisterRequest = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      role: role
    };

    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      registerData
    );
  }
}