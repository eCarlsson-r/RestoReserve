import { Component, computed, inject, output } from "@angular/core";
import { NgFor, NgIf, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../services/cart.service";
import { QuantitySelectorComponent } from "./quantity-selector.component";

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink, QuantitySelectorComponent],
  template: `
    <div class="fixed inset-0 z-100 flex justify-end overflow-hidden">
      <div class="absolute inset-0 bg-brand-dark/60 backdrop-blur-md transition-opacity" (click)="close.emit()"></div>
      
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        <div class="p-8 border-b border-stone-100 flex justify-between items-center">
          <div>
            <h2 class="font-display text-3xl italic text-brand-dark">Your Selection</h2>
            <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">
              Table {{ cart.currentSession()?.table_id }} • {{ cart.items().length }} Items
            </p>
          </div>
          <button (click)="close.emit()" class="text-stone-300 hover:text-brand-dark transition-colors">✕</button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          <div *ngIf="cart.items().length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
            <span class="text-4xl mb-4">🍽️</span>
            <p class="font-display italic">Your cart is empty</p>
          </div>

          <div *ngFor="let item of cart.items()" class="bg-stone-50 rounded-3xl p-4 flex gap-4 border border-stone-100">
            <img [src]="item.image_url" class="w-20 h-20 rounded-2xl object-cover bg-white">
            
            <div class="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 class="font-black uppercase italic text-[10px] tracking-tight text-brand-dark">{{ item.name }}</h3>
                <p class="font-display text-sm italic" [class.text-emerald-600]="cart.isProductIncluded(item.id)">
                  <span *ngIf="cart.isProductIncluded(item.id)" class="line-through text-slate-300 mr-2">
                    {{ item.price | currency:'IDR':'symbol':'1.0-0' }}
                  </span>
                  {{ (cart.isProductIncluded(item.id) ? 0 : item.price) | currency:'IDR':'symbol':'1.0-0' }}
                </p>
              </div>
              
              <app-quantity-selector [quantity]="item.quantity" (changed)="updateQty(item.id, $event)" />
            </div>
          </div>
        </div>

        <div class="p-8 bg-brand-dark text-white rounded-t-[3rem] space-y-6">
          <div *ngIf="savings() > 0" class="flex justify-between items-center bg-white/10 rounded-2xl p-4 border border-white/10 animate-pulse">
            <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400">Buffet Savings</span>
            <span class="font-display italic text-emerald-400 text-lg">+ {{ savings() | currency:'IDR':'symbol':'1.0-0' }}</span>
          </div>

          <div class="flex justify-between items-end">
            <div>
              <p class="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Total to Pay</p>
              <p class="font-display text-4xl italic tracking-tighter">{{ cart.total() | currency:'IDR':'symbol':'1.0-0' }}</p>
            </div>
            <button routerLink="/checkout" class="bg-brand-primary px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartDrawerComponent {
  cart = inject(CartService);
  close = output<void>();

  // Calculate total "Saved" value for Buffet guests
  savings = computed(() => {
    return this.cart.items().reduce((acc, item) => {
      if (this.cart.isProductIncluded(item.id)) {
        return acc + (item.price * item.quantity);
      }
      return acc;
    }, 0);
  });

  updateQty(id: number, qty: number) {
    this.cart.items.update(items => items.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }
}