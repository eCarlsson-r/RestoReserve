import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from "../services/auth.service";

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  // If logged in, they shouldn't be here (e.g. at /login), send to dashboard.
  return auth.isLoggedIn() 
    ? router.createUrlTree(['/profile']) 
    : true;
};