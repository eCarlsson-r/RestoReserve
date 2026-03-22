import { Component } from "@angular/core";

@Component({
  selector: 'app-reservation-sheet',
  template: `
    <div class="bg-white rounded-t-2xl p-6 text-brand-dark">
      <h2 class="font-display text-2xl mb-4">Book Your Table</h2>
      
      <div class="space-y-4">
        <input type="date" class="w-full p-4 rounded-xl bg-stone-100 border-none font-bold" />
        
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-stone-100 rounded-xl text-center">
            <span class="block text-[10px] uppercase opacity-50">Adults</span>
            <input type="number" class="bg-transparent text-center font-black text-xl w-full" value="2">
          </div>
          <div class="p-4 bg-stone-100 rounded-xl text-center">
            <span class="block text-[10px] uppercase opacity-50">Children</span>
            <input type="number" class="bg-transparent text-center font-black text-xl w-full" value="0">
          </div>
        </div>

        <button (click)="submit()" class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic shadow-lg shadow-brand-primary/30">
          Confirm Reservation
        </button>
      </div>
    </div>
  `
})
export class ReservationSheet {
  submit() {
    throw new Error('Method not implemented.');
  }
}