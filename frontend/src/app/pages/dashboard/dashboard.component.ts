import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  userName = '';
  isProviderOrAdmin = false;

  constructor(private router: Router) {
    this.userName = localStorage.getItem('userName') || 'User';
    const role = (localStorage.getItem('userRole') || '').toUpperCase();
    this.isProviderOrAdmin = role === 'PROVIDER' || role === 'ADMIN';
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    this.router.navigate(['/login']);
  }
}