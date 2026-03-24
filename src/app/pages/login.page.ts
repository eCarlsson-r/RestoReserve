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
    <div class="min-h-dvh bg-brand-dark flex flex-col p-8">
      <header class="pt-12 pb-20">
        <h1 class="font-display text-6xl italic text-white leading-none">Red Velvet</h1>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mt-4">
          Exclusive Membership
        </p>
      </header>

      <main class="grow space-y-12 max-w-sm w-full mx-auto">
        <div class="space-y-6">
          <div class="group border-b border-white/10 focus-within:border-brand-primary transition-colors pb-2">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Username</label>
            <input type="text" [(ngModel)]="credentials().username" 
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none placeholder:text-white/5"
                   placeholder="yourname123">
          </div>

          <div class="group border-b border-white/10 focus-within:border-brand-primary transition-colors pb-2">
            <label class="block text-[8px] font-black uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input type="password" [(ngModel)]="credentials().password"
                   class="w-full bg-transparent text-white font-display italic text-2xl outline-none placeholder:text-white/5"
                   placeholder="••••••••">
          </div>
        </div>

        <div class="space-y-6">
          <button (click)="handleLogin()" 
                  [disabled]="isLoading()"
                  class="w-full py-6 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            {{ isLoading() ? 'Authenticating...' : 'Sign In' }}
          </button>
          
          <p class="text-center text-[10px] text-white/30 font-black uppercase tracking-widest">
            Don't have an account? 
            <a routerLink="/register" class="text-brand-primary ml-2">Register</a>
          </p>
        </div>
      </main>

      <footer class="pb-8 text-center">
        <p class="text-[8px] font-bold text-white/20 uppercase tracking-[0.5em]">Reserved for our finest guests</p>
      </footer>
    </div>
  `
})
export default class LoginPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  credentials = signal({ username: '', password: '' });
  isLoading = signal(false);

  async handleLogin() {
    this.isLoading.set(true);

    this.authService.login(this.credentials()).subscribe({
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