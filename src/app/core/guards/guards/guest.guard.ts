import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // If user is not logged in, allow access to guest routes (login, signup)
  if (!authService.isLoggedIn()) {
    return true;
  }
  
  // If user is already logged in, redirect to timeline
  return router.createUrlTree(['/timeline']);
}; 