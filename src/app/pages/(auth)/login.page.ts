import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../../guards/guest.guard';

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mx-auto w-full space-y-8">
        <div class="text-center">
          <h1 class="font-display text-5xl italic text-white">RV</h1>
          <p class="text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Red Velvet Members
          </p>
        </div>

        <form (submit)="handleLogin()" class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-white/40 ml-4">Username</label>
            <input 
              [(ngModel)]="credentials().username" name="username"
              type="text" placeholder="yourname123"
              class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-white/40 ml-4">Password</label>
            <input 
              [(ngModel)]="credentials().password" name="password"
              type="password" placeholder="••••••••"
              class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <button 
            type="submit"
            class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic shadow-xl shadow-brand-primary/20 active:scale-95 transition-transform"
          >
            Enter The Buffet
          </button>
        </form>

        <p class="text-center text-white/40 text-xs">
          Don't have an account? 
          <a href="/register" class="text-brand-accent font-bold">Sign Up</a>
        </p>
      </div>
  `
})
export default class LoginPage {
  authService = inject(AuthService);
  router = inject(Router);
  credentials = signal({ username: '', password: '' });

  async handleLogin() {
    this.authService.login(this.credentials()).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: () => alert("Invalid credentials")
    });
  }
}