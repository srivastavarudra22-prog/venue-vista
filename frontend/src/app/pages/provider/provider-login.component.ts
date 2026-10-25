import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-provider-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-login.component.html',
  styleUrl: './provider-login.component.css'
})
export class ProviderLoginComponent {

  email = 'provider@example.com';
  password = 'provider123';

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  login(): void {
    if (this.isLoading) return;

    this.message = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const role = (response.role || '').toUpperCase();
        
        // Verify this is a provider or admin
        if (role !== 'PROVIDER' && role !== 'ADMIN') {
          this.errorMessage = 'Access denied: This portal is for Venue Providers & Admins only. Please use the Customer Login.';
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('userName', response.name);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userRole', response.role);

        this.message = 'Welcome, Provider! Redirecting...';
        this.isLoading = false;
        this.cdr.detectChanges();

        this.router.navigate(['/provider/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Invalid provider email or password';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  useDemoCredentials(): void {
    this.email = 'provider@example.com';
    this.password = 'provider123';
  }
}
