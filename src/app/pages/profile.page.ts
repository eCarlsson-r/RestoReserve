// src/app/pages/profile.page.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIf, DecimalPipe, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service'; // Import this
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../guards/auth.guard';
import { BirthdayRewardComponent } from '../components/birthday-reward.component';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard],
};

@Component({
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, DecimalPipe, BirthdayRewardComponent],
  template: `
    <div class="min-h-screen bg-stone-50 pb-32" *ngIf="auth.user()">
      <header class="p-8 bg-brand-dark text-white rounded-b-[3rem] shadow-2xl">
        <div class="max-w-xl mx-auto flex justify-between items-end">
          <div>
            <p class="text-[8px] font-black uppercase tracking-[0.4em] text-brand-primary mb-1">
              {{ auth.user().customer?.tier }} Member
            </p>
            <h1 class="font-display text-4xl italic">{{ auth.user().name }}</h1>
          </div>
          <div class="text-right">
            <p class="font-display text-4xl italic text-brand-primary">
              {{ (auth.user().customer?.points || 0) | number }}
            </p>
            <p class="text-[8px] font-black uppercase tracking-widest text-white/40">Points</p>
          </div>
        </div>
      </header>

      <app-birthday-reward *ngIf="birthday()" />

      <section class="max-w-xl mx-auto px-8 mt-12 space-y-6">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Past Visits</h3>
        
        <div *ngFor="let sale of history()" class="bg-white rounded-4xl p-6 shadow-sm border border-stone-100">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-tighter text-brand-dark">
                {{ sale.branch?.name }}
              </p>
              <p class="text-[8px] text-slate-400 uppercase">{{ sale.date | date:'dd MMM yyyy' }}</p>
            </div>
            <span class="bg-brand-primary/10 text-brand-primary text-[8px] font-black px-3 py-1 rounded-full">
              +{{ (sale.invoices[0]?.pay_amount / 1000) | number:'1.0-0' }} PTS
            </span>

            <div class="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
              <p class="text-[8px] font-bold text-slate-400 uppercase">
                {{ sale.records.length }} total items
              </p>
            </div>

            <button (click)="reorder(sale)" 
                    class="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
              <span>↻</span>
              Re-order All
            </button>
          </div>

          <div class="space-y-2 border-t border-stone-50 pt-4">
            <div *ngFor="let record of sale.records.slice(0, 2)" class="flex justify-between text-[10px]">
              <span class="text-slate-500 italic">{{ record.quantity }}x {{ record.product?.name }}</span>
              <span class="font-bold">{{ record.item_price | currency:'IDR':'symbol':'1.0-0' }}</span>
            </div>
            <p *ngIf="sale.records.length > 2" class="text-[8px] text-brand-primary italic font-bold">
              + {{ sale.records.length - 2 }} more items...
            </p>
          </div>
        </div>
      </section>
    </div>
  `
})
export default class ProfilePage implements OnInit {
  auth = inject(AuthService);
  cart = inject(CartService);

  // Link this component's user signal directly to the AuthService user signal
  user = signal<any>(null);
  history = signal<any[]>([]);
  birthday = signal(false);

  ngOnInit() {
    this.user.set(this.auth.getUser());
    this.auth.getUserHistory().subscribe((history) => {
      this.history.set(history);
    });

    if (this.user()?.customer?.can_claim_birthday_buffet) {
      setTimeout(() => this.birthday.set(true), 1000);
    }
  }

  // src/app/pages/profile.page.ts
  reorder(sale: any) {
    // 1. Map the sale records to CartItems
    const itemsToAdd = sale.records.map((record: any) => ({
      id: record.item_code, // Linking to Product ID
      name: record.product?.name || 'Unknown Item',
      price: record.item_price,
      quantity: record.quantity,
      image_url: record.product?.image_url || 'assets/placeholder.webp'
    }));

    // 2. Add them to the global cart
    itemsToAdd.forEach((item: any) => this.cart.addToCart(item));
  }
}