// src/app/pages/checkout.page.ts
import { Component, inject, computed } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [CurrencyPipe, NgIf, NgFor],
  template: `
    <div class="min-h-screen bg-stone-50 p-6 md:p-12">
      <div class="max-w-2xl mx-auto space-y-8">
        
        <header class="flex justify-between items-end border-b border-stone-200 pb-8">
          <div>
            <h1 class="font-display text-5xl italic text-brand-dark">Review Order</h1>
            <p *ngIf="cart.currentSession()" class="text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-2">
              ✨ Active {{ cart.currentSession()?.tier_name }} Session
            </p>
          </div>
          <p class="text-[10px] font-black uppercase text-slate-400 italic">{{ cart.items().length }} Items</p>
        </header>

        <div class="space-y-4">
          <div *ngFor="let item of cart.items()" class="bg-white rounded-3xl p-6 flex justify-between items-center shadow-sm border border-stone-100">
            <div class="flex items-center gap-4">
              <span class="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center font-black italic text-xs">{{ item.quantity }}x</span>
              <div>
                <h3 class="font-black uppercase italic text-xs tracking-tight">{{ item.name }}</h3>
                <p *ngIf="isFree(item)" class="text-[8px] font-bold text-emerald-500 uppercase">Included in Buffet</p>
              </div>
            </div>
            <p class="font-display italic text-lg" [class.line-through]="isFree(item)" [class.text-slate-300]="isFree(item)">
              {{ (item.price * item.quantity) | currency:'IDR':'symbol':'1.0-0' }}
            </p>
          </div>
        </div>

        <div class="bg-brand-dark rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
          <div class="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>Subtotal</span>
            <span>{{ cart.total() | currency:'IDR':'symbol':'1.0-0' }}</span>
          </div>
          <div class="h-px bg-white/10"></div>
          <div class="flex justify-between items-center">
            <span class="font-display text-2xl italic">Grand Total</span>
            <span class="font-display text-4xl italic text-brand-primary">
              {{ cart.total() | currency:'IDR':'symbol':'1.0-0' }}
            </span>
          </div>

          <button (click)="submitOrder()" class="w-full py-6 bg-white text-brand-dark rounded-2xl font-black uppercase italic tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl">
            Confirm Order
          </button>
        </div>

      </div>
    </div>
  `
})
export default class CheckoutPage {
  cart = inject(CartService);

  isFree(item: any) {
    return this.cart.currentSession()?.is_buffet && item.is_buffet_eligible;
  }

  async submitOrder() {
    const orderData = {
      items: this.cart.items(),
      total: this.cart.total(),
      reservation_id: this.cart.currentSession()?.reservation_id
    };

    this.cart.createOrder(orderData).subscribe({
      next: (res) => {
        console.log('Order created successfully:', res);
        this.cart.items.set([]);
      },
      error: (err) => {
        console.error('Error creating order:', err);
      }
    });
  }
}