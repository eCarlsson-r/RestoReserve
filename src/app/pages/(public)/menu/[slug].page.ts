import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { BasketService } from "../../../services/basket.service";
import { Product, ProductService } from "../../../services/product.service";
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../../../guards/guest.guard';
import { ProductDetailComponent } from "../../../components/product-detail-slideover.component";

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
    imports: [CommonModule, ProductDetailComponent],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div *ngFor="let product of products()" (click)="openDetail(product)" class="relative group bg-white rounded-4xl overflow-hidden shadow-sm border border-stone-100">
        
        <div class="relative aspect-square">
          <img [src]="product.image" class="w-full h-full object-cover">
          
          <div *ngIf="product.price > 0" 
               class="absolute top-4 right-4 bg-brand-dark/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl">
            <p class="text-[8px] font-black uppercase opacity-60 leading-none">Ala Carte</p>
            <p class="font-display text-lg italic">Rp {{ product.price | number }}</p>
          </div>

          <div *ngIf="product.price == 0" 
               class="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-xl">
            <p class="text-[8px] font-black uppercase leading-none">Included</p>
            <p class="font-display text-lg italic">AYCE</p>
          </div>
        </div>

        <div class="p-6">
          <h3 class="font-display text-2xl italic text-brand-dark">{{ product.name }}</h3>
          <p class="text-xs text-slate-400 mt-2 line-clamp-2">{{ product.description }}</p>
          
          <button *ngIf="isLoggedIn()" 
                  (click)="addToBasket(product)"
                  class="mt-6 w-full py-3 border-2 border-brand-primary text-brand-primary rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-brand-primary hover:text-white transition-all">
            Add to Order
          </button>
        </div>
      </div>

      <app-product-detail 
        *ngIf="activeProduct()" 
        [product]="activeProduct()" 
        (close)="closeDetail()" 
      />
    </div>
  `
})
export default class ProductList {
    private authService = inject(AuthService);
    private productService = inject(ProductService);
    private basketService = inject(BasketService);
    private route = inject(ActivatedRoute);

    products = signal<Product[]>([]);
    isLoading = signal(false);
    activeProduct = signal<any | null>(null);

    openDetail(product: any) {
      this.activeProduct.set(product);
    }

    closeDetail() {
      this.activeProduct.set(null);
    }

    ngOnInit() {
        const slug = this.route.snapshot.params['slug'];
        this.productService.getProducts(slug).subscribe(data => {
            this.products.set(data);
            this.isLoading.set(false);
        });
    }

    addToBasket(product: Product) {
        this.basketService.addToBasket(product);
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}
