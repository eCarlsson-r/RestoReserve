import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  selector: 'app-reserve',
  imports: [FormsModule],
  template: `
    <div class="p-8 max-w-md mx-auto space-y-8">
      <h2 class="font-display text-4xl italic">Book a Buffet</h2>
      
      <form (submit)="submitReservation()" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Event Date</label>
          <input type="date" [(ngModel)]="form.date" name="date" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Guaranteed Pax</label>
          <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100">
            <button type="button" (click)="dec()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">-</button>
            <span class="flex-1 text-center font-display text-2xl italic">{{ form.pax }}</span>
            <button type="button" (click)="inc()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">+</button>
          </div>
        </div>

        <button class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl">
          Check Availability
        </button>
      </form>
    </div>
  `
})
export default class ReservePage {
  form = { date: '', pax: 2 };

  inc() {
    this.form.pax++;
  }

  dec() {
    if (this.form.pax > 2) this.form.pax--;
  }

  submitReservation() {
    console.log('Submitting:', this.form);
    // Logic to send to Laravel: POST /api/reservations
  }
}