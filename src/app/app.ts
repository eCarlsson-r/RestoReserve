// src/app/app.component.ts
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CartService } from './services/cart.service';
import { FloatingNavComponent } from './components/floating-nav.component';
import { CartDrawerComponent } from './components/cart-drawer.component';
import { UpgradeModalComponent } from './components/upgrade-modal.component';
import { FloatingCartComponent } from './components/floating-cart.component';
import { CallWaiterModalComponent } from "./components/call-waiter-modal.component";
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgFor, FloatingNavComponent, FloatingCartComponent, CartDrawerComponent, UpgradeModalComponent, CallWaiterModalComponent],
  template: `
    <div class="antialiased font-sans text-brand-dark selection:bg-brand-primary selection:text-white">
      
      <header *ngIf="cart.currentSession()" 
        class="fixed top-0 w-full z-60 bg-brand-dark/90 backdrop-blur-md px-6 py-2 flex justify-between items-center">
  
        <div class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full" 
                [class.bg-emerald-500]="cart.remainingSeconds()! > 600"
                [class.bg-brand-primary]="cart.remainingSeconds()! <= 600 && cart.remainingSeconds()! > 300"
                [class.bg-red-500]="cart.remainingSeconds()! <= 300"
                [class.animate-pulse]="cart.remainingSeconds()! <= 300">
          </span>
          <p class="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
            Table {{ cart.currentSession()?.table_id }}
          </p>
        </div>

        <div class="flex flex-col items-end">
          <p class="text-[10px] font-display italic text-brand-primary tracking-widest">
            {{ cart.formattedTime() }}
          </p>
          <p class="text-[6px] font-black uppercase text-white/30 tracking-widest">Time Remaining</p>
        </div>
      </header>

      <main [class.pt-10]="cart.currentSession()">
        <router-outlet></router-outlet>
      </main>

      <app-floating-nav 
        *ngIf="showNav()"
        (openCart)="isCartOpen.set(true)" 
        (callWaiter)="isCallWaiterOpen.set(true)" 
        (openUpgrade)="isUpgradeOpen.set(true)" 
      />

      <app-floating-cart 
        *ngIf="isCartOpen()" 
        (close)="isCartOpen.set(false)" 
      />

      <app-cart-drawer 
        *ngIf="isCartOpen()" 
        (close)="isCartOpen.set(false)" 
      />

      <app-upgrade-modal 
        *ngIf="isUpgradeOpen()" 
        (close)="isUpgradeOpen.set(false)" 
      />

      <app-call-waiter [(show)]="isCallWaiterOpen" />

      <div class="fixed top-12 left-0 w-full z-100 px-6 pointer-events-none space-y-2">
        <div *ngFor="let t of toast.toasts()" 
             class="w-full max-w-sm mx-auto p-4 bg-brand-dark/95 backdrop-blur shadow-2xl rounded-2xl border border-white/10 flex items-center gap-4 animate-in slide-in-from-top duration-300 pointer-events-auto">
          <span class="text-brand-primary">✦</span>
          <p class="text-[10px] font-black uppercase tracking-widest text-white">{{ t.message }}</p>
        </div>
      </div>
    </div>
  `
})
export class App {
  cart = inject(CartService);
  toast = inject(ToastService);
  
  isCartOpen = signal(false);
  isUpgradeOpen = signal(false);
  isCallWaiterOpen = signal(false);

  // Hide Nav on Login/Register pages for a cleaner aesthetic
  showNav = signal(true); 
}