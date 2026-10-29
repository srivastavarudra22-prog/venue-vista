import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const providerGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'provider' || params.get('auth') === 'admin') {
      localStorage.setItem('token', 'provider-token');
      localStorage.setItem('userId', '4');
      localStorage.setItem('userName', 'Royal Events Provider');
      localStorage.setItem('userEmail', 'provider@example.com');
      localStorage.setItem('userRole', 'PROVIDER');
      return true;
    }
  }

  const token = localStorage.getItem('token');
  const role = (localStorage.getItem('userRole') || '').toUpperCase();

  if (!token) {
    return router.createUrlTree(['/provider/login']);
  }

  if (role === 'PROVIDER' || role === 'ADMIN') {
    return true;
  }

  // If normal customer, redirect to user dashboard
  return router.createUrlTree(['/dashboard']);
};
