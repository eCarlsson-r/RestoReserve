// src/app/pages/checkout.page.ts
import { Component, inject, computed, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

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
              ✨ Active {{ cart.currentSession()?.buffet?.name }} Session
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
                <p *ngIf="isFree(item.id)" class="text-[8px] font-bold text-emerald-500 uppercase">Included in Buffet</p>
              </div>
            </div>
            <p class="font-display italic text-lg" [class.line-through]="isFree(item.id)" [class.text-slate-300]="isFree(item.id)">
              {{ (item.price * item.quantity) | currency:'IDR':'symbol':'1.0-0' }}
            </p>
          </div>
        </div>

        <div *ngIf="cart.total() > 0 && auth.user()?.customer?.points > 0" 
            class="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center mb-4">
          <div>
            <p class="text-[8px] font-black uppercase text-brand-primary">Loyalty Discount</p>
            <p class="text-xs italic text-white/60">Use {{ auth.user().customer.points }} points?</p>
          </div>
          <button (click)="applyPoints()" class="text-[10px] font-black uppercase text-brand-primary border border-brand-primary px-4 py-2 rounded-full">
            Apply
          </button>
        </div>

        <div class="bg-brand-dark rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
          <div class="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>Subtotal</span>
            <span>{{ cart.total() | currency:'IDR':'symbol':'1.0-0' }}</span>
          </div>
          <div *ngIf="discountFromPoints() > 0" class="flex justify-between text-[10px] font-black uppercase text-emerald-400">
            <span>Point Redemption</span>
            <span>- {{ discountFromPoints() | currency:'IDR' }}</span>
          </div>
          <div class="h-px bg-white/10"></div>
          <div class="flex justify-between items-center">
            <span class="font-display text-2xl italic">Grand Total</span>
            <span class="font-display text-4xl italic text-brand-primary">
              {{ (cart.total() - discountFromPoints()) | currency:'IDR':'symbol':'1.0-0' }}
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
// src/app/pages/checkout.page.ts
export default class CheckoutPage {
  auth = inject(AuthService);
  cart = inject(CartService);
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  pointsUsed = signal(0);
  discountFromPoints = signal(0);

  isFree(productId: number): boolean {
    return this.cart.isProductIncluded(productId);
  }

  applyPoints() {
    const customer = this.auth.user()?.customer;
    if (!customer || customer.points <= 0) return;

    // 1 Point = Rp 1 (Adjust ratio as needed)
    const totalPayable = this.cart.total();
    const availablePoints = customer.points;

    // Calculate how many points to use (cannot exceed the total or the balance)
    const pointsToUse = Math.min(totalPayable, availablePoints);
    
    this.pointsUsed.set(pointsToUse);
    this.discountFromPoints.set(pointsToUse); // Rp discount
    
    this.toast.show(`Applied Rp ${pointsToUse.toLocaleString()} discount from your points!`, "success");
  }

  submitOrder() {
    const session = this.cart.currentSession();
    
    // Prepare data for SalesController@store
    const payload = {
      branch_id: session?.branch_slug, // Or ID
      table_id: session?.table_id,
      buffet_id: session?.buffet?.id,
      items: this.cart.items().map(item => ({
        item_code: item.id,
        quantity: item.quantity,
        item_price: this.isFree(item.id) ? 0 : item.price,
        item_type: 'product'
      })),
      points_redeemed: this.pointsUsed(), // Send this to Laravel
    final_total: this.cart.total() - this.discountFromPoints(), // Send this to Laravel
    };

    this.api.post('orders', payload).subscribe({
      next: (res: any) => {
        this.cart.items.set([]); // Clear cart
        this.router.navigate(['/profile']); // Go see the active order status
      },
      error: (err) => this.toast.show('Order failed. Please call the waiter.', "error")
    });
  }
}