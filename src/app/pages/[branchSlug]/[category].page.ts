import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Product } from 'src/types';
import { ProductDetailComponent } from "../../components/product-detail-slideover.component";
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductDetailComponent],
  template: `
    <div class="min-h-screen bg-stone-50 pb-24">
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-5 border-b border-stone-100 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button (click)="goBack()" class="w-10 h-10 flex items-center justify-center rounded-full text-stone-50">←</button>
          <div>
            <h1 class="font-display text-2xl italic leading-none capitalize">{{ category() }}</h1>
            <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">{{ branchName() }}</p>
          </div>
        </div>
      </header>

      <div *ngIf="!isLoading()" class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div *ngFor="let item of products()" (click)="openDetail(item)" 
             class="bg-white rounded-4xl p-4 flex gap-4 border border-stone-100 shadow-sm relative overflow-hidden"
             [class.opacity-50]="!item.pivot.is_active">
          
          <div class="w-24 h-24 rounded-2xl bg-stone-100 overflow-hidden flex-none">
            <img [src]="item.files?.[0]?.url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 flex flex-col justify-center">
            <h3 class="font-black uppercase italic text-xs tracking-tight text-brand-dark mb-1">{{ item.name }}</h3>
            
            <p class="font-display italic text-brand-primary">
              {{ item.price | currency:'IDR':'symbol':'1.0-0' }}
            </p>
          </div>

          <div *ngIf="!item.pivot.is_active" 
               class="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <span class="px-3 py-1 bg-brand-dark text-white text-[8px] font-black uppercase tracking-tighter rounded-full">
              Temporarily Unavailable
            </span>
          </div>
        </div>
      </div>

      <app-product-detail 
        *ngIf="selectedProduct()" 
        [product]="selectedProduct()" 
        [session]="currentSession()"
        (close)="selectedProduct.set(null)"
        (addToCart)="handleAddToCart($event)"
      />
    </div>
  `
})
export default class ProductListPage {
  private route = inject(ActivatedRoute);
  private service = inject(MenuService);
  private cartService = inject(CartService);
  products = signal<Product[]>([]);
  branchName = signal<string | null>(null);
  isLoading = signal(false);
  selectedProduct = signal<any | null>(null);
  currentSession = signal(null);
  
  // Route Parameters
  branch = toSignal(this.route.paramMap.pipe(map(p => p.get('branchSlug'))));
  category = toSignal(this.route.paramMap.pipe(map(p => p.get('category'))));

  ngOnInit() {
    this.isLoading.set(true);
      this.service.getCategoryProducts(this.branch()!, this.category()!).subscribe(data => {
          this.products.set(data.products);
          this.branchName.set(data.branch.name);
          this.isLoading.set(false);
      });
  }

  handleAddToCart($event: any) {
    this.cartService.addToCart($event);
    this.selectedProduct.set(null);
  }

  openDetail(product: any) { this.selectedProduct.set(product); }

  goBack() { window.history.back(); }
}