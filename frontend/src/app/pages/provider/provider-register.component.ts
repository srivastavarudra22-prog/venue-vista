import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-provider-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './provider-register.component.html',
  styleUrl: './provider-register.component.css'
})
export class ProviderRegisterComponent {

  name = '';
  email = '';
  password = '';
  phone = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  register(): void {
    if (this.isLoading) return;

    this.message = '';
    this.errorMessage = '';
    this.isLoading = true;

    // Register with PROVIDER role
    this.authService.register(
      this.name,
      this.email,
      this.password,
      this.phone,
      'PROVIDER'
    ).subscribe({
      next: (response) => {
        this.message = 'Provider account registered successfully! Redirecting to login...';
        this.isLoading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/provider/login']);
        }, 1500);
      },
      error: (error) => {
        if (error?.error?.phone) {
          this.errorMessage = error.error.phone;
        } else if (error?.error?.email) {
          this.errorMessage = error.error.email;
        } else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Registration failed. Make sure phone has 10 digits and email is valid.';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
