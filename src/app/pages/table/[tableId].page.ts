// src/app/pages/table/[tableId].page.ts
import { Component, computed, inject, signal } from '@angular/core';
import { addToCart, cartCount, cartTotal } from '../../stores/cart.store';
import { GeoBlockComponent } from '../../components/geo-block.component';
import { calculateDistance } from '../../utils/geo';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../../guards/auth.guard';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard]
};

@Component({
  selector: 'app-customer-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, GeoBlockComponent],
  template: `
    <app-geo-block 
      *ngIf="isTooFar()" 
      (retry)="checkProximity()" 
    />
    <div *ngIf="menuService.isLoading()">
       <div class="animate-pulse p-6 space-y-4">
         <div class="h-10 w-1/2 bg-slate-100 rounded-lg"></div>
         <div class="h-64 bg-slate-50 rounded-[3rem]"></div>
       </div>
    </div>

    <div *ngIf="!menuService.isLoading()">
      <nav class="flex gap-2 p-4 overflow-x-auto">
        <button 
          *ngFor="let cat of menuService.categories()"
          (click)="selectedCategory.set(cat['category-code'])"
          [class.bg-black]="selectedCategory() === cat['category-code']"
          class="px-5 py-2 rounded-full border text-[10px] font-black uppercase">
          {{ cat['category-name'] }}
        </button>
      </nav>

      <div class="p-6 grid gap-6">
        <div *ngFor="let item of filteredProducts()" class="flex gap-4">
           </div>
      </div>
    </div>

    <div class="min-h-screen bg-white pb-24">
      <header class="p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-black italic tracking-tighter uppercase">Republican</h1>
          <p class="text-[10px] font-bold text-slate-400 uppercase">Table {{ tableId }}</p>
        </div>
        <button class="bg-slate-100 p-3 rounded-full">
            <lucide-icon name="bell" size="18" />
        </button>
      </header>

      <div class="flex gap-4 px-6 overflow-x-auto no-scrollbar py-4">
        <button *ngFor="let cat of menuService.categories()" 
                class="whitespace-nowrap px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest">
          {{ cat.name }}
        </button>
      </div>

      <div class="px-6 space-y-8 mt-6">
        <div *ngFor="let product of filteredProducts()" 
             (click)="addToCart(product)"
             class="flex justify-between items-center group active:scale-95 transition-all">
          <div class="flex-1">
            <h3 class="font-black uppercase italic text-lg leading-tight">{{ product.name }}</h3>
            <p class="text-xs text-slate-400">{{ product.description }}</p>
            <p class="mt-2 font-black">Rp {{ product.price | number }}</p>
          </div>
          <div class="w-24 h-24 bg-slate-50 rounded-4xl overflow-hidden">
            <img [src]="'/images/' + product.imgId" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div *ngIf="cartCount() > 0" 
           class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-black text-white p-6 rounded-2xl flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom">
        <div>
          <p class="text-[10px] font-bold uppercase opacity-60">{{ cartCount() }} Items</p>
          <p class="font-black italic">View Order</p>
        </div>
        <div class="text-right">
          <p class="text-xl font-black italic">Rp {{ cartTotal() | number }}</p>
        </div>
      </div>
    </div>
  `
})
export default class CustomerMenuPage {
  menuService = inject(MenuService);
  tableId = inject(ActivatedRoute).snapshot.params['tableId'];

  isTooFar = signal(false);
  restaurantCoords = { lat: -6.2345, lng: 106.8123 }; // This should come from your Laravel Branch API
  
  cartCount = cartCount;
  cartTotal = cartTotal;
  addToCart = addToCart;

  selectedCategory = signal(1); // Default to Nasi

  // Computed signal: Automatically updates whenever selectedCategory or products change
  filteredProducts = computed(() => {
    return this.menuService.products().filter(
      p => p.categoryId === this.selectedCategory()
    );
  });

  products = signal([]);
  categories = signal([]);

  ngOnInit() {
    this.checkProximity();
    // Usually, you'd get the branch code from the URL or a token
    this.menuService.loadMenuData('DMBRC').subscribe();
  }
  
  callWaiter(type: 'ASSISTANCE' | 'BILL' = 'ASSISTANCE') {
    this.menuService.callWaiter({
      table: this.tableId,
      branch: 'DMBRC',
      type: type
    }).subscribe({
      next: () => alert('A waiter is on their way!'),
      error: () => alert('Connection error. Please try again.')
    });
  }

  checkProximity() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const dist = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        this.restaurantCoords.lat,
        this.restaurantCoords.lng
      );

      // If distance > 100 meters, flag as too far
      if (dist > 0.1) {
        this.isTooFar.set(true);
      }
    });
  }
}