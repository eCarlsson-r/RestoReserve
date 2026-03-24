import { NgIf } from "@angular/common";
import { Component, signal } from "@angular/core";

@Component({
  selector: 'app-birthday-reward',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="show()" class="fixed inset-0 z-200 flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl animate-in fade-in duration-700"></div>
      
      <div class="relative w-full max-w-sm bg-linear-to-br from-brand-primary to-[#B8860B] p-1 rounded-4xl shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-in zoom-in-95 duration-500">
        <div class="bg-brand-dark rounded-3xl p-10 flex flex-col items-center text-center space-y-6">
          
          <span class="text-4xl">🎁</span>
          
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-2">Exclusive Reward</p>
            <h2 class="font-display text-4xl italic text-white">Birthday Buffet</h2>
          </div>

          <p class="text-xs text-white/60 leading-relaxed italic">
            Happy Birthday, {{ name() }}! As a valued member, enjoy a complimentary Buffet session on us today.
          </p>

          <div class="w-full py-4 border-y border-white/10 flex justify-between items-center">
            <span class="text-[8px] font-black uppercase text-white/40">Valid Until</span>
            <span class="text-[10px] font-black uppercase text-white">Midnight Today</span>
          </div>

          <button (click)="claim()" class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
            Claim Now
          </button>
          
          <button (click)="show.set(false)" class="text-[8px] font-black uppercase tracking-widest text-white/20">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  `
})
export class BirthdayRewardComponent {
  show = signal(false);
  name = signal('');
  
  claim() {
    // Logic to update the Sale in Laravel to "Birthday Comp"
    // POST /api/reservations/claim-birthday
    this.show.set(false);
  }
}