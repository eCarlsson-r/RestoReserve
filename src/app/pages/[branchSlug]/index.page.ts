import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { Category, Product } from '../../../types';
import { NgFor, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-stone-50 pb-32">
      <header class="p-8 md:p-16 bg-white border-b border-stone-100">
        <div class="max-w-7xl mx-auto">
          <p class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-2">Red Velvet Menu</p>
          <h1 class="font-display text-5xl md:text-7xl italic text-brand-dark leading-none capitalize">
            {{ branchName() }}
          </h1>
        </div>
      </header>

      <section *ngIf="!isLoading()" class="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <a *ngFor="let cat of categories()" 
             [routerLink]="['/', branchSlug(), cat.slug]"
             class="group aspect-square bg-white rounded-2xl md:rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-stone-100 hover:border-brand-primary/20 transition-all hover:-translate-y-1">
            
            <div class="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-brand-dark group-hover:bg-brand-primary group-hover:text-white transition-colors mb-4">
              <lucide-icon [name]="cat.icon_name" size="32" strokeWidth="1.5"></lucide-icon>
            </div>

            <p class="font-black uppercase italic text-[10px] tracking-widest text-center">
              {{ cat.name }}
            </p>
          </a>
        </div>
      </section>

      <div class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div class="bg-brand-dark/95 backdrop-blur-lg rounded-full p-2 shadow-2xl flex items-center justify-between border border-white/10">
          <button class="flex-1 py-3 text-white text-[10px] font-black uppercase tracking-widest italic">Menu</button>
          <div class="w-px h-4 bg-white/20"></div>
          <button class="flex-1 py-3 text-white/50 text-[10px] font-black uppercase tracking-widest italic hover:text-white transition-colors">Search</button>
          <div class="w-px h-4 bg-white/20"></div>
          <button class="flex-1 py-3 text-white/50 text-[10px] font-black uppercase tracking-widest italic hover:text-white transition-colors">Cart (0)</button>
        </div>
      </div>
    </div>
  `
})
export default class BranchMenuPage {
    private authService = inject(AuthService);
    private menuService = inject(MenuService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    categories = signal<Category[]>([]);
    branchName = signal<string | null>(null);
    branchSlug = signal<string | null>(this.route.snapshot.params['branchSlug']);
    isLoading = signal(false);
    activeProduct = signal<any | null>(null);

    openDetail(product: any) {
      this.activeProduct.set(product);
    }

    closeDetail() {
      this.activeProduct.set(null);
    }

    ngOnInit() {
      this.isLoading.set(true);
        this.menuService.getBranchCategories(this.route.snapshot.params['branchSlug']).subscribe(data => {
          this.categories.set(data.categories);
          this.branchName.set(data.branch.name);
          this.isLoading.set(false);
        });
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    goToCategory(slug: string) {
        if (slug) this.router.navigate([`/${this.route.snapshot.params['branchSlug']}/${slug}`]);
    }
}