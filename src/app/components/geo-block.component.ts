import { Component, output } from '@angular/core';

@Component({
  selector: 'app-geo-block',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-100 bg-brand-dark/95 backdrop-blur-md flex items-center justify-center p-8 text-center">
      <div class="max-w-xs space-y-6">
        <div class="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-brand-primary/30">
          <span class="text-brand-accent text-4xl italic font-display">!</span>
        </div>
        
        <h2 class="font-display text-3xl italic text-white uppercase tracking-tighter">Out of Range</h2>
        
        <p class="text-white/60 text-sm leading-relaxed">
          Digital ordering is restricted to guests physically present at 
          <span class="text-brand-accent font-bold">Red Velvet Buffet</span>.
        </p>

        <button 
          (click)="retry.emit()" 
          class="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-brand-accent transition-colors">
          Retry Location Check
        </button>
      </div>
    </div>
  `
})
export class GeoBlockComponent {
  retry = output<void>();
}