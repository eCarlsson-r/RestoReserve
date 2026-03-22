import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // If logged in, let them pass. If not, send to login.
  return authService.isLoggedIn() 
    ? true 
    : router.createUrlTree(['/login']);
};