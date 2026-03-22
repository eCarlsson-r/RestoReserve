// src/app/components/product-detail-slideover.component.ts
import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="fixed inset-0 z-100 flex justify-end overflow-hidden">
      <div 
        class="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
        (click)="close.emit()">
      </div>
      
      <div class="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col 
                  animate-in slide-in-from-right duration-500 ease-out">
        
        <div class="relative h-96 w-full bg-stone-200">
          <img [src]="product().image" class="w-full h-full object-cover">
          <button (click)="close.emit()" 
                  class="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/30">
            ✕
          </button>
        </div>

        <div class="flex-1 p-10 overflow-y-auto space-y-8">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase tracking-widest text-brand-primary">Premium Selection</span>
              <h2 class="font-display text-4xl italic text-brand-dark leading-none">{{ product().name }}</h2>
            </div>
            <div class="text-right">
               <p class="text-[10px] font-bold text-slate-400 uppercase">Ala Carte</p>
               <p class="font-display text-2xl italic text-brand-dark">
                 {{ product().price | currency:'IDR':'symbol':'1.0-0' }}
               </p>
            </div>
          </div>

          <p class="text-stone-500 leading-relaxed font-light italic">
            {{ product().description }}
          </p>

          <div class="p-6 bg-stone-50 rounded-4xl border border-stone-100 space-y-3">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Perfect Pairing</h4>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center text-xl">🍶</div>
              <div>
                <p class="text-xs font-black uppercase italic">Junmai Daiginjo Sake</p>
                <p class="text-[10px] text-slate-400">Enhances the marbling of the wagyu.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 border-t border-stone-100 bg-white">
          <button class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform">
            Add to Order
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent {
  product = input.required<any>();
  close = output<void>();
}