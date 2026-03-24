import { Component, inject, output, signal } from "@angular/core";
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../services/cart.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-floating-nav',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 animate-in slide-in-from-bottom-10 duration-700">
      <div class="bg-brand-dark/95 backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center justify-between border border-white/10">
        
        <a routerLink="/" class="flex-1 py-3 text-center text-white text-[10px] font-black uppercase tracking-widest italic transition-opacity hover:opacity-70">
          Menu
        </a>

        <div class="w-px h-4 bg-white/10"></div>

        <button *ngIf="cart.currentSession()" (click)="callWaiter.emit()" 
                class="flex-1 py-3 flex items-center justify-center gap-2 group text-white text-[10px] font-black uppercase tracking-widest italic">
          Call Waiter
        </button>

        <div class="w-px h-4 bg-white/10"></div>

        <button *ngIf="!cart.currentSession()?.is_buffet" 
                (click)="openUpgrade.emit()"
                class="flex-1 py-3 text-brand-primary text-[10px] font-black uppercase tracking-widest italic animate-pulse">
          Go Buffet
        </button>
        <button *ngIf="cart.currentSession()?.is_buffet" 
                class="flex-1 py-3 text-white/50 text-[10px] font-black uppercase tracking-widest italic">
          Search
        </button>

        <div class="w-px h-4 bg-white/10"></div>

        <button (click)="openCart.emit()" 
                class="flex-1 py-3 flex items-center justify-center gap-2 group">
          <span class="text-white text-[10px] font-black uppercase tracking-widest italic">
            Cart
          </span>
          <span *ngIf="cart.items().length > 0" 
                class="bg-brand-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center scale-110 group-active:scale-90 transition-transform">
            {{ cart.items().length }}
          </span>
        </button>

        <div class="w-px h-4 bg-white/10"></div>

        <a *ngIf="loggedIn()" routerLink="/profile" class="flex-1 py-3 text-center text-white text-[10px] font-black uppercase tracking-widest italic transition-opacity hover:opacity-70">
          Profile
        </a>
        <a *ngIf="!loggedIn()" routerLink="/login" class="flex-1 py-3 text-center text-white text-[10px] font-black uppercase tracking-widest italic transition-opacity hover:opacity-70">
          Login
        </a>
      </div>
    </div>
  `
})
export class FloatingNavComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  openCart = output<void>();
  openUpgrade = output<void>();
  callWaiter = output<void>();
  loggedIn = signal<boolean>(this.auth.isLoggedIn());
}