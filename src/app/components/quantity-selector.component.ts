import { Component, input, output } from "@angular/core";

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  template: `
    <div class="flex items-center bg-stone-100 rounded-full p-1 gap-4">
      <button (click)="decrement()" 
              class="w-8 h-8 rounded-full text-white shadow-sm flex items-center justify-center bg-brand-dark active:scale-90 transition-transform">
        —
      </button>
      
      <span class="font-display italic text-lg w-4 text-center">{{ quantity() }}</span>
      
      <button (click)="increment()" 
              class="w-8 h-8 rounded-full bg-brand-dark text-white shadow-sm flex items-center justify-center active:scale-90 transition-transform">
        +
      </button>
    </div>
  `
})
export class QuantitySelectorComponent {
  quantity = input.required<number>();
  changed = output<number>();

  increment() { this.changed.emit(this.quantity() + 1); }
  decrement() { if (this.quantity() > 1) this.changed.emit(this.quantity() - 1); }
}