// src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = inject(TokenService);
  private api = inject(ApiService);
  private router = inject(Router);

  // Points to your Laravel Auth endpoint
  constructor() {
    // If we have a token but no user, go get the user data from Laravel
    if (this.token.isLoggedIn() && !this.user()) {
      this.fetchCurrentUser();
    }
  }

  // Global Signals for authentication state
  user = signal<any | null>(null);
  isLoading = signal(false);

  login(credentials: { username: string, password: string }) {
    return this.api.post<any>(`login`, credentials);
  }

  register(credentials: { name: string, dob: string, phone: string, email: string, username: string, password: string }) {
    return this.api.post<any>(`register`, credentials);
  }

  fetchCurrentUser() {
    this.api.get<any>(`user`).subscribe({
      next: (user) => this.saveUser(user),
      error: () => this.logout() // Token probably expired
    });
  }

  saveUser(user: any) {
    this.user.set(user.customer);
  }

  saveToken(token: string) {
    this.token.set(token);
  }

  getUser() {
    return this.api.get<any>(`user`);
  }

  getUserHistory() {
    return this.api.get<any>(`user/history`);
  }

  isLoggedIn() {
    return this.token.isLoggedIn();
  }

  logout() {
    this.token.clear();
    this.user.set(null);
    this.router.navigate(['/']);
  }
}
