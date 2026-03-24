import { Component, inject, input, output } from "@angular/core";
import { CurrencyPipe, NgIf } from "@angular/common";
import { CartService } from "../services/cart.service";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, NgIf],
  template: `
    <div class="fixed inset-0 z-100 flex justify-end overflow-hidden">
      <div class="absolute inset-0 bg-brand-dark/60 backdrop-blur-md transition-opacity" (click)="close.emit()"></div>
      
      <div class="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
        
        <div class="relative h-[45vh] w-full bg-stone-200 overflow-hidden">
          <img [src]="product().files?.[0]?.url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000">
          <button (click)="close.emit()" class="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full text-white flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">✕</button>
        </div>

        <div class="flex-1 p-8 md:p-12 overflow-y-auto space-y-10 no-scrollbar">
          <div class="flex justify-between items-start border-b border-stone-100 pb-8">
            <div class="space-y-2">
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">
                {{ product().category?.name || 'Selection' }}
              </span>
              <h2 class="font-display text-4xl md:text-5xl italic text-brand-dark leading-tight">{{ product().name }}</h2>
            </div>
            
            <div class="text-right">
              <div [class.border-emerald-500]="cart.isProductIncluded(product().id)">
                <span *ngIf="cart.isProductIncluded(product().id)" class="text-emerald-500">✨ Included</span>
                <span *ngIf="!cart.isProductIncluded(product().id)">{{ product().price | currency:'IDR':'symbol':'1.0-0' }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</h4>
            <p class="text-stone-500 leading-relaxed font-light italic text-lg">
              {{ product().description || 'A masterpiece of flavor, prepared with the finest ingredients by our master chefs.' }}
            </p>
          </div>
        </div>

        <div class="p-8 border-t border-stone-100 bg-white/80 backdrop-blur-md">
          <button 
            (click)="addToCart.emit(product())"
            [disabled]="!product().pivot?.is_active"
            class="w-full py-6 bg-brand-dark text-white rounded-2xl font-black uppercase italic tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:bg-stone-200 disabled:text-stone-400">
            {{ product().pivot?.is_active ? 'Add to Order' : 'Out of Stock' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent {
  product = input.required<any>();
  session = input<any>(null); // Passed from the parent page
  close = output<void>();
  addToCart = output<any>();
  cart = inject(CartService);

  isIncludedInBuffet(): boolean {
    const s = this.session();
    return !!(s && s.is_buffet && this.product().is_buffet_eligible);
  }
}