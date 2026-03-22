// src/app/pages/index.page.ts
import { Component, inject, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from "lucide-angular";
import { Product, ProductService } from '../../services/product.service';
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../../guards/auth.guard';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard]
};

@Component({
  standalone: true,
  imports: [NgIf, NgFor, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-stone-50 pb-20">
      <header class="p-8 bg-white rounded-b-[3rem] shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Welcome Back</p>
        <h1 class="font-display text-4xl italic text-brand-dark">{{ user()?.name }}</h1>
        
        <div class="flex gap-6 mt-6">
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Visits</span>
            <span class="text-xl font-black italic">{{ user()?.total_visits }}</span>
          </div>
          <div class="w-px h-8 bg-stone-100"></div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Points</span>
            <span class="text-xl font-black italic text-brand-primary">{{ user()?.points }}</span>
          </div>
        </div>
      </header>

      <main class="p-6 space-y-6 -mt-4">
        <div 
            *ngIf="user().can_claim_birthday_buffet"
            class="relative overflow-hidden p-6 rounded-4xl bg-linear-to-br from-rose-600 via-brand-primary to-brand-dark text-white shadow-2xl shadow-rose-500/20"
        >
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="text-4xl animate-bounce">🎁</div>
                <div class="flex-1">
                    <h2 class="font-display text-2xl italic tracking-tighter">It's Your Day!</h2>
                    <p class="text-[10px] font-black uppercase tracking-widest opacity-80">Free Birthday Buffet Unlocked</p>
                </div>
                <button class="bg-white text-brand-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase italic shadow-lg">
                Show QR
                </button>
            </div>
        </div>

        <div class="p-6 bg-brand-dark rounded-3xl text-white flex justify-between items-center shadow-xl shadow-brand-dark/20">
          <div class="space-y-1">
            <h3 class="font-black uppercase italic text-sm">Dining Now?</h3>
            <p class="text-[10px] opacity-60">Scan the QR code on your table to order.</p>
          </div>
          <button class="p-4 bg-brand-primary rounded-2xl animate-pulse">
            <lucide-icon name="qr-code" size="24"></lucide-icon>
          </button>
        </div>

        <section>
          <h4 class="font-display text-xl italic mb-4">Chef's Recommendations</h4>
          <div class="flex overflow-x-auto gap-4 no-scrollbar">
            <div *ngFor="let item of featuredProducts()" class="flex-none w-48 bg-white p-3 rounded-2xl shadow-sm border border-stone-100">
               <img [src]="item.image" class="w-full h-32 object-cover rounded-xl mb-3">
               <p class="text-xs font-black uppercase italic">{{ item.name }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `
})
export default class DashboardPage {
    public authService = inject(AuthService);
    private productService = inject(ProductService);
    user = this.authService.user;
    featuredProducts = signal<Product[]>([]);

    ngOnInit() {
        this.authService.getUser().subscribe(user => {
            this.user.set(user);
        });
        this.productService.getFeaturedProducts().subscribe(data => this.featuredProducts.set(data));
    }
}