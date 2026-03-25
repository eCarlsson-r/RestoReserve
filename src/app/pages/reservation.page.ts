import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../services/api.service";
import { NgFor, NgIf } from "@angular/common";
import { Branch, BuffetPackage } from "src/types";
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../guards/auth.guard';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard],
};

@Component({
  standalone: true,
  selector: 'app-reserve',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <div class="p-8 space-y-8">
      <h2 class="font-display text-4xl italic">Book a Buffet</h2>
      
      <form (submit)="submitReservation()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Event Date and Time</label>
            <input type="datetime-local" [(ngModel)]="form.datetime" name="datetime" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
          </div>

          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Guaranteed Pax</label>
            <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100">
              <button type="button" (click)="dec()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">-</button>
              <span class="flex-1 text-center font-display text-2xl italic">{{ form.pax }}</span>
              <button type="button" (click)="inc()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">+</button>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Deposit</label>
            <input [(ngModel)]="form.deposit" name="deposit" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngIf="branches().length > 0">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Event Branch</label>
            <select [(ngModel)]="form.branch_id" name="buffet_id" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <option value="" disabled>Select Branch</option>
              <option *ngFor="let branch of branches()" [value]="branch.id">{{ branch.name }}</option>
            </select>
          </div>

          <div *ngIf="buffets().length > 0">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Buffet</label>
            <select [(ngModel)]="form.buffet_id" name="buffet_id" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <option value="" disabled>Select Buffet</option>
              <option *ngFor="let buffet of buffets()" [value]="buffet.id">{{ buffet.name }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Notes</label>
          <textarea [(ngModel)]="form.notes" name="notes" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm"></textarea>
        </div>

        <button class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl">
          Check Availability
        </button>
      </form>
    </div>
  `
})
export default class ReservePage {
  private api = inject(ApiService);
  branches = signal<Branch[]>([]);
  buffets = signal<BuffetPackage[]>([]);
  form = { datetime: '', pax: 2, deposit: 0, notes: '', branch_id: 0, buffet_id: 0 };

  constructor() {
    this.api.get('branches').subscribe((res: any) => this.branches.set(res));
    this.api.get('buffets').subscribe((res: any) => this.buffets.set(res));
  }

  inc() {
    this.form.pax++;
  }

  dec() {
    if (this.form.pax > 2) this.form.pax--;
  }

  submitReservation() {
    this.api.post('reservations', this.form).subscribe({
      next: (res) => alert('Reservation successful! See you soon.'),
      error: (err) => alert('Check availability for this date.')
    });
  }
}