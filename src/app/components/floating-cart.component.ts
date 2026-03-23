import { Component, inject } from "@angular/core";
import { CartService } from "../services/cart.service";
import { CurrencyPipe, NgIf } from "@angular/common";

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CurrencyPipe, NgIf],
  template: `
    <div *ngIf="cart.items().length > 0" 
         class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-90 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button class="w-full bg-brand-dark text-white rounded-4xl p-2 flex items-center justify-between shadow-2xl border border-white/10 group active:scale-95 transition-all">
        
        <div class="flex items-center gap-4 ml-4">
          <div class="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center font-black italic text-sm">
            {{ cart.items().length }}
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest italic">Items Ordered</span>
        </div>

        <div class="mr-6 text-right">
          <p class="text-[8px] font-bold text-white/40 uppercase tracking-tighter">Current Total</p>
          <p class="font-display text-xl italic">
            {{ cart.total() | currency:'IDR':'symbol':'1.0-0' }}
          </p>
        </div>
      </button>
    </div>
  `
})
export class FloatingCartComponent {
  cart = inject(CartService);
}