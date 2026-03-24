import { Component, inject, signal } from "@angular/core";
import { CartService } from "../services/cart.service";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-8 text-center">
      
      <div class="w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center mb-8 animate-bounce">
        <span class="text-4xl text-white">✓</span>
      </div>

      <h1 class="font-display text-5xl italic mb-4">Order Received</h1>
      <p class="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
        Our chefs are preparing your selection
      </p>

      <div *ngIf="cart.currentSession()?.is_buffet" 
           class="w-full max-w-sm p-10 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-md">
        
        <p class="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-4">
          {{ cart.currentSession()?.buffet?.name }} Session
        </p>
        
        <div class="font-display text-7xl italic tracking-tighter mb-4">
          {{ timeLeft() }}
        </div>
        
        <p class="text-white/40 text-[8px] font-bold uppercase tracking-widest">
          Remaining for All-You-Can-Eat Orders
        </p>
      </div>

      <button routerLink="/" class="mt-12 text-[10px] font-black uppercase italic border-b border-brand-primary pb-1">
        Back to Menu
      </button>
    </div>
  `
})
export default class OrderSuccessPage {
  cart = inject(CartService);
  timeLeft = signal('00:00');

  constructor() {
    this.startCountdown();
  }

  startCountdown() {
    const expiry = this.cart.currentSession()?.expires_at;
    if (!expiry) return;

    setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expiry).getTime() - now;

      if (distance < 0) {
        this.timeLeft.set('00:00');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      this.timeLeft.set(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
  }
}