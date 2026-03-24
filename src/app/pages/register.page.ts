// src/app/pages/register.page.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../services/auth.service";
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../guards/guest.guard';
import { ToastService } from '../services/toast.service';

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-dvh bg-brand-dark flex flex-col p-8 overflow-y-auto">
      <header class="pt-8 pb-12">
        <a routerLink="/login" class="text-white/20 text-sm mb-8 block">← Back</a>
        <h1 class="font-display text-5xl italic text-white leading-none">Create Account</h1>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mt-4">
          Begin your journey with us
        </p>
      </header>

      <main class="grow space-y-10 max-w-sm w-full mx-auto pb-12">
        <div class="space-y-8">
          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Full Name</label>
            <input type="text" [(ngModel)]="name" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="Your Name">
          </div>

          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Birthday</label>
            <input type="date" [(ngModel)]="birthday" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="Your Birthday">
          </div>

          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Phone Number</label>
            <input type="tel" [(ngModel)]="phone" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="+62...">
          </div>

          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Email Address</label>
            <input type="email" [(ngModel)]="email" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="hello@exclusive.com">
          </div>

          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Username</label>
            <input type="text" [(ngModel)]="username" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="yourname123">
          </div>

          <div class="border-b border-white/10 focus-within:border-brand-primary pb-2 transition-colors">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input type="password" [(ngModel)]="password" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none"
                   placeholder="••••••••">
          </div>
        </div>

        <div class="pt-4">
          <button (click)="handleRegister()" 
                  [disabled]="isLoading()"
                  class="w-full py-6 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
            {{ isLoading() ? 'Creating Account...' : 'Join Red Velvet' }}
          </button>
        </div>
      </main>
    </div>
  `
})
export default class RegisterPage { 
    authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);
    name = '';
    birthday = '';
    phone = '';
    email = '';
    username = '';
    password = '';
    isLoading = signal(false);

    async handleRegister() {
        this.authService.register({
            name: this.name,
            dob: this.birthday,
            phone: this.phone,
            email: this.email,
            username: this.username,
            password: this.password
        }).subscribe({
        next: (res) => {
            this.authService.saveUser(res.user);
            this.authService.saveToken(res.token);
            this.isLoading.set(false);
            this.router.navigate(['/profile']);
        },
        error: () => this.toastService.show("Invalid credentials", "error")
        });
    }
}