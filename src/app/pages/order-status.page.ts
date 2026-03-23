import { Component, inject, signal, computed } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-brand-dark text-white p-8 md:p-16 flex flex-col items-center justify-center space-y-12">
      
      <div class="text-center space-y-2">
        <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <span class="text-2xl">✓</span>
        </div>
        <h1 class="font-display text-4xl italic">Order Sent to Kitchen</h1>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Preparing your selection</p>
      </div>

      <div *ngIf="cart.currentSession()?.is_buffet" class="relative w-64 h-64 flex items-center justify-center">
        <svg class="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="4" fill="transparent" class="text-white/10" />
          <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="4" fill="transparent" 
                  class="text-brand-primary transition-all duration-1000"
                  [style.stroke-dasharray]="754"
                  [style.stroke-dashoffset]="dashOffset()" />
        </svg>
        
        <div class="text-center">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Time Remaining</p>
          <span class="font-display text-6xl italic tracking-tighter">{{ timeLeft() }}</span>
        </div>
      </div>

      <div class="w-full max-w-xs space-y-4">
        <button routerLink="/" class="w-full py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-white/20 transition-all">
          Order More Items
        </button>
        <p class="text-center text-[8px] font-bold text-white/20 uppercase">Table 12 • Server: Budi</p>
      </div>
    </div>
  `
})
export default class OrderStatusPage {
  cart = inject(CartService);
  
  // Logic for the 90-minute countdown
  remainingSeconds = signal(5400); // 90 minutes
  
  timeLeft = computed(() => {
    const m = Math.floor(this.remainingSeconds() / 60);
    const s = this.remainingSeconds() % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  });

  dashOffset = computed(() => {
    const total = 5400;
    const progress = this.remainingSeconds() / total;
    return 754 * (1 - progress);
  });

  constructor() {
    if (this.cart.currentSession()?.expires_at) {
      const endAt = new Date(this.cart.currentSession()!.expires_at!).getTime();
      const now = new Date().getTime();
      this.remainingSeconds.set(Math.max(0, Math.floor((endAt - now) / 1000)));
    }
    
    // Simple timer interval
    setInterval(() => {
      if (this.remainingSeconds() > 0) {
        this.remainingSeconds.update(s => s - 1);
      }
    }, 1000);
  }
}