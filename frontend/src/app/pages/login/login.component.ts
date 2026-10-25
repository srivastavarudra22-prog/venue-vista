import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  login(): void {

    // Prevent multiple login requests
    if (this.isLoading) {
      return;
    }

    this.message = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      // Login successful
      next: (response) => {

        console.log('Login successful:', response);

        // Save login information in browser
        localStorage.setItem('token', response.token);
        localStorage.setItem(
          'userId',
          response.userId.toString()
        );
        localStorage.setItem(
          'userName',
          response.name
        );
        localStorage.setItem(
          'userEmail',
          response.email
        );
        localStorage.setItem(
          'userRole',
          response.role
        );

        this.message = 'Login successful!';
        this.isLoading = false;

        // Refresh Angular UI immediately
        this.cdr.detectChanges();

        // Route based on role
        const role = (response.role || '').toUpperCase();
        if (role === 'PROVIDER' || role === 'ADMIN') {
          this.router.navigate(['/provider/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },

      // Login failed
      error: (error) => {

        console.error('Login failed:', error);

        this.errorMessage =
          error?.error?.message ||
          'Invalid email or password';

        this.isLoading = false;

        // Refresh Angular UI immediately
        this.cdr.detectChanges();
      }

    });
  }
}