import { Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { ProductDetailComponent } from '../components/product-detail-slideover.component';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, ProductDetailComponent],
  template: `
    <div class="bg-stone-50 min-h-screen pb-20">
      <section class="h-[60vh] relative flex items-center justify-center bg-brand-dark overflow-hidden">
        <div class="absolute inset-0 bg-linear-to-b from-brand-dark/20 to-brand-dark/80 z-10"></div>
        
        <div class="relative z-20 text-center px-6">
          <h1 class="font-display text-7xl text-white italic tracking-tighter leading-none mb-4">
            Red <span class="text-brand-primary">Velvet</span>
          </h1>
          <p class="text-white/60 text-[10px] font-black uppercase tracking-[0.5em]">
            Premium All-You-Can-Eat Dining
          </p>
        </div>
      </section>

      <section class="p-6 -mt-20 relative z-30">
        <h3 class="text-white text-[10px] font-black uppercase mb-4 tracking-widest px-4">Our Locations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let category of categories()" 
               class="bg-white rounded-5xl p-8 shadow-2xl border border-stone-100 group cursor-pointer"
               (click)="selectCategory(category.slug)">
            <div class="flex justify-between items-start mb-6">
              <h2 class="font-display text-3xl italic text-brand-dark">{{ category.name }}</h2>
              <div class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse">Open Now</div>
            </div>
            <p class="text-xs text-slate-400 font-bold mb-4 uppercase">{{ category.description }}</p>
            <button class="text-brand-primary text-[10px] font-black uppercase italic tracking-widest border-b-2 border-brand-primary pb-1">
              Explore Menu →
            </button>
          </div>
        </div>
      </section>

      <section class="mt-12">
        <div class="px-8 flex justify-between items-end mb-6">
          <h4 class="font-display text-2xl italic text-brand-dark">Chef's Highlights</h4>
          <a href="/login" class="text-[10px] font-black uppercase text-brand-primary italic">Join Members to Order</a>
        </div>
        
        <div class="flex overflow-x-auto gap-6 px-8 no-scrollbar">
          <div *ngFor="let prod of featuredProducts()" (click)="openDetail(prod)" class="flex-none w-64 group">
            <div class="aspect-square rounded-4xl overflow-hidden mb-4 shadow-lg ring-1 ring-stone-200">
               <img [src]="prod.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop'" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700">
            </div>
            <h5 class="font-black uppercase italic text-xs mb-1 tracking-tighter">{{ prod.name }}</h5>
            <p class="text-[10px] text-slate-400 font-bold">Included in Platinum Package</p>
          </div>
        </div>
      </section>

      <app-product-detail 
        *ngIf="activeProduct()" 
        [product]="activeProduct()" 
        (close)="closeDetail()" 
      />
    </div>
  `
})
export default class LandingPage {
  private productService = inject(ProductService);
  private router = inject(Router);

  categories = signal<any[]>([]);
  featuredProducts = signal<Product[]>([]);
  activeProduct = signal<any | null>(null);

  openDetail(product: any) {
    this.activeProduct.set(product);
  }

  closeDetail() {
    this.activeProduct.set(null);
  }

  ngOnInit() {
    this.productService.getCategories().subscribe(data => this.categories.set(data));
    this.productService.getFeaturedProducts().subscribe(data => this.featuredProducts.set(data.slice(0, 5)));
  }

  selectCategory(slug: string) {
    this.router.navigate([`/menu/${slug}`]);
  }
}