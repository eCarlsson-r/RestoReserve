// src/app/services/auth.service.ts
import { Inject, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface AuthResponse {
  token: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Points to your Laravel Auth endpoint
  private apiUrl = '/api';
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  // Global Signals for authentication state
  token = signal<string | null>(isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null);
  user = signal<any | null>(null);
  isLoading = signal(false);

  login(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: { name: string, dob: string, username: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/register`, credentials);
  }

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) localStorage.setItem('token', token);
    this.token.set(token);
  }

  saveUser(user: any) {
    this.user.set(user);
  }

  getToken() {
    return this.token();
  }
  
  isLoggedIn() {
    return !!this.token();
  }

  getUser() {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.token.set(null);
    this.user.set(null);
  }
}
