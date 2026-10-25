import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const providerGuard: CanActivateFn = () => {
  const router = inject(Router);
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
