import { Component, inject, model } from "@angular/core";
import { ApiService } from "../services/api.service";
import { CartService } from "../services/cart.service";
import { NgFor, NgIf } from "@angular/common";
import { ToastService } from "../services/toast.service";

@Component({
  selector: 'app-call-waiter',
  imports: [NgIf, NgFor],
  standalone: true,
  template: `
    <div *ngIf="show()" class="fixed inset-0 z-200 flex items-end sm:items-center justify-center p-4">
      <div class="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" (click)="show.set(false)"></div>
      
      <div class="relative w-full max-w-sm bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <h2 class="font-display text-3xl italic mb-6">How can we assist?</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <button *ngFor="let option of options" 
                  (click)="sendRequest(option)"
                  class="p-6 border border-stone-100 rounded-3xl flex flex-col items-center gap-3 hover:bg-stone-50 active:scale-95 transition-all">
            <span class="text-2xl">{{ option.icon }}</span>
            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class CallWaiterModalComponent {
    show = model<boolean>(false);
    api = inject(ApiService);
    cart = inject(CartService);
    toast = inject(ToastService);

    options = [
        { label: 'General Help', icon: '👋', type: 'general' },
        { label: 'Refill Water', icon: '💧', type: 'water' },
        { label: 'Request Bill', icon: '🧾', type: 'bill' },
        { label: 'Clean Table', icon: '✨', type: 'clean' }
    ];

    sendRequest(option: any) {
        const session = this.cart.currentSession();
        const payload = {
        table_id: session?.table_id,
        branch_id: session?.branch_slug,
        request_type: option.label
        };

        this.api.post('call-waiter', payload).subscribe({
        next: () => {
            this.toast.show("A waiter is on their way to Table " + session?.table_id, "success");
            this.show.set(false);
        }
        });
    }
}