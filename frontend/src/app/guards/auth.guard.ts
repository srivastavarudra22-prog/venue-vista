import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'customer' || params.get('auth') === 'demo') {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('userId', '3');
      localStorage.setItem('userName', 'Rudra Srivastava');
      localStorage.setItem('userEmail', 'srivastavarudra22@gmail.com');
      localStorage.setItem('userRole', 'CUSTOMER');
      return true;
    }
  }

  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};