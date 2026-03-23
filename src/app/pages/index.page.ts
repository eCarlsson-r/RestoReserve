import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { NgFor, NgIf } from "@angular/common";
import { MenuService } from "../services/menu.service";
import { Branch, Product } from "../../types";
import { ProductDetailComponent } from "../components/product-detail-slideover.component";
import { CartService } from "../services/cart.service";

@Component({
  standalone: true,
  imports: [NgFor, NgIf, ProductDetailComponent],
  template: `
    <div class="w-full min-h-screen bg-stone-50 flex flex-col items-center">
      <section class="w-full aspect-video md:aspect-21/9 bg-brand-dark relative flex items-center justify-center overflow-hidden">
        <div class="relative z-10 text-center px-6 max-w-7xl mx-auto">
          <h1 class="text-[clamp(3.5rem,12vw,9rem)] font-display text-white italic leading-[0.85] tracking-tighter mb-6">
            Red <span class="text-brand-primary">Velvet</span>
          </h1>
          <p class="text-[clamp(0.7rem,2vw,1rem)] text-white/40 font-black uppercase tracking-[0.4em] md:tracking-[0.8em]">
            The Art of Infinite Dining
          </p>
        </div>
      </section>

      <section class="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-16 md:-mt-32 relative z-20 pb-24">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          
          <div *ngFor="let branch of branches()" 
              (click)="viewMenu(branch.slug)"
              class="group bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl shadow-stone-200 border border-stone-100 flex flex-col justify-between transition-all hover:-translate-y-2 hover:shadow-brand-primary/5 cursor-pointer min-h-[320px]">
            
            <div class="space-y-4">
              <div class="flex justify-between items-start">
                <h2 class="font-display text-3xl md:text-5xl italic text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">
                  {{ branch.name }}
                </h2>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-3"></span>
              </div>
              <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">{{ branch.city }}</p>
            </div>

            <div class="pt-12 border-t border-stone-50 flex items-center justify-between">
              <span class="text-[11px] font-black uppercase italic tracking-widest text-brand-primary">Explore Menu</span>
              <span class="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
          
        </div>
      </section>

      <section class="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div class="flex justify-between items-end mb-8">
          <h4 class="font-display text-3xl italic text-brand-dark">Signature Specialties</h4>
          <a routerLink="/login" class="text-[10px] font-black uppercase text-brand-primary border-b-2 border-brand-primary/20 pb-1">
            Join Members to Order
          </a>
        </div>
        
        <div class="flex overflow-x-auto gap-8 no-scrollbar pb-8">
          <div *ngFor="let prod of featuredProducts()" (click)="openDetail(prod)" class="flex-none w-72 group cursor-pointer">
            <div class="aspect-4/5 rounded-3xl overflow-hidden mb-5 shadow-xl ring-1 ring-stone-200">
               <img [src]="prod.files?.[0]?.url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'" 
                    class="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700">
            </div>
            <div class="px-2">
              <h5 class="font-black uppercase italic text-sm mb-1 tracking-tight text-brand-dark">{{ prod.name }}</h5>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-brand-primary"></span>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Premium Buffet Inclusion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
export default class LandingPage {
  private router = inject(Router);
  private service = inject(MenuService);
  private cartService = inject(CartService);

  branches = signal<Branch[]>([]);
  featuredProducts = signal<Product[]>([]);
  selectedProduct = signal<any | null>(null);
  currentSession = signal(null);
  
  ngOnInit() {
    this.service.loadHome().subscribe(data => {
      this.branches.set(data.branches);
      this.featuredProducts.set(data.featured_products);
    });
  }

  viewMenu(slug: string) {
    this.router.navigate([`/${slug}`]); // Navigates to the branch category list
  }

  handleAddToCart($event: any) {
    this.cartService.addToCart($event);
    this.selectedProduct.set(null);
  }

  openDetail(product: any) { this.selectedProduct.set(product); }
}