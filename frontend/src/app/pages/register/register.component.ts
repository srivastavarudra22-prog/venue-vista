import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  phone = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  register(): void {

    if (this.isLoading) {
      return;
    }

    this.message = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.register(
      this.name,
      this.email,
      this.password,
      this.phone
    ).subscribe({

      next: (response) => {

        console.log('Registration successful:', response);

        this.message = 'Registration successful! You can now login.';

        this.name = '';
        this.email = '';
        this.password = '';
        this.phone = '';

        this.isLoading = false;

        // Refresh Angular UI immediately
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Registration failed:', error);

        if (error?.error?.phone) {
          this.errorMessage = error.error.phone;
        }
        else if (error?.error?.email) {
          this.errorMessage = error.error.email;
        }
        else if (error?.error?.name) {
          this.errorMessage = error.error.name;
        }
        else if (error?.error?.password) {
          this.errorMessage = error.error.password;
        }
        else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        }
        else {
          this.errorMessage = 'Registration failed. Please try again.';
        }

        this.isLoading = false;

        // Refresh Angular UI immediately
        this.cdr.detectChanges();
      }
    });
  }
}