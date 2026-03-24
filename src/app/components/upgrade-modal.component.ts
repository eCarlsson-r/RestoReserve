import { Component, inject, signal, output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { CartService } from '../services/cart.service';
import { MenuService } from '../services/menu.service';
import { BuffetPackage } from 'src/types';

@Component({
  selector: 'app-upgrade-modal',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="fixed inset-0 z-110 flex items-end md:items-center justify-center p-4">
      <div class="absolute inset-0 bg-brand-dark/80 backdrop-blur-xl" (click)="close.emit()"></div>
      
      <div class="relative w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
        <h2 class="font-display text-4xl italic text-brand-dark mb-2 text-center">Select Your Tier</h2>
        <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mb-10">Upgrade Table {{ cart.currentSession()?.table_id }}</p>

        <div *ngIf="buffets().length > 0" class="space-y-4">
          <div *ngFor="let tier of buffets()"
          (click)="(!(cart.currentSession()?.buffet?.id === tier.id)) && selectTier(tier)"
              class="relative p-6 rounded-3xl border-2 transition-all"
              [class.border-brand-primary]="cart.currentSession()?.buffet?.id === tier.id"
              [class.opacity-50]="cart.currentSession()?.buffet?.id === tier.id">
              
            <h3 class="font-display text-2xl italic">{{ tier.name }}</h3>
            
            <span *ngIf="cart.currentSession()?.buffet?.id === tier.id" 
                  class="absolute top-4 right-4 bg-brand-primary text-white text-[8px] px-2 py-1 rounded-full uppercase">
              Current
            </span>
          </div>
        </div>
        <div *ngIf="buffets().length === 0" class="text-center py-12">
          <p class="text-slate-400">No buffet tiers available for this branch.</p>
        </div>
      </div>
    </div>
  `
})
export class UpgradeModalComponent {
  cart = inject(CartService);
  private menu = inject(MenuService);
  close = output<void>();
  buffets = signal<BuffetPackage[]>([]);
  
  ngOnInit() {
    const session = this.cart.currentSession();
    if (session && session.branch_slug) {
      this.menu.getBranchBuffets(session.branch_slug).subscribe(data => {
        this.buffets.set(data);
      });
    }
  }

  selectTier(tier: BuffetPackage) {
    this.cart.currentSession.update(s => s ? {
      ...s,
      is_buffet: true,
      buffet: tier,
      expires_at: new Date(Date.now() + tier.duration_minutes * 60 * 1000) // 90 min timer
    } : null);
    
    this.close.emit();
  }
}