import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../services/api.service";
import { I18nService } from "../services/i18n.service";
import { NgFor, NgIf } from "@angular/common";
import { Branch, BuffetPackage } from "src/types";
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../guards/auth.guard';
import { ReservationChatComponent } from "../components/reservation-chat.component";

export const routeMeta: RouteMeta = {
  canActivate: [authGuard],
};

@Component({
  standalone: true,
  selector: 'app-reserve',
  imports: [FormsModule, NgIf, NgFor, ReservationChatComponent],
  template: `
    <div class="p-8 space-y-8">
      <div class="flex items-start justify-between">
        <h2 class="font-display text-4xl italic">{{ t()('reserve.title') }}</h2>

        <div class="flex gap-1 bg-white border border-stone-100 rounded-full p-1 shadow-sm">
          <button *ngFor="let l of i18n.locales" (click)="i18n.setLocale(l.code)"
                  class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                  [class.bg-brand-dark]="i18n.locale() === l.code"
                  [class.text-white]="i18n.locale() === l.code"
                  [class.text-slate-400]="i18n.locale() !== l.code">
            {{ l.label }}
          </button>
        </div>
      </div>

      <form (submit)="submitReservation()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.datetime') }}</label>
            <input type="datetime-local" [(ngModel)]="form.datetime" name="datetime" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
          </div>

          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.pax') }}</label>
            <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-stone-100">
              <button type="button" (click)="dec()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">-</button>
              <span class="flex-1 text-center font-display text-2xl italic">{{ form.pax }}</span>
              <button type="button" (click)="inc()" class="w-12 h-12 rounded-xl bg-stone-50 font-bold">+</button>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.deposit') }}</label>
            <input [(ngModel)]="form.deposit" name="deposit" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngIf="branches().length > 0">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.branch') }}</label>
            <select [(ngModel)]="form.branch_id" name="branch_id" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <option value="" disabled>{{ t()('reserve.selectBranch') }}</option>
              <option *ngFor="let branch of branches()" [value]="branch.id">{{ branch.name }}</option>
            </select>
          </div>

          <div *ngIf="buffets().length > 0">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.buffet') }}</label>
            <select [(ngModel)]="form.buffet_id" name="buffet_id" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <option value="" disabled>{{ t()('reserve.selectBuffet') }}</option>
              <option *ngFor="let buffet of buffets()" [value]="buffet.id">{{ buffet.name }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase text-slate-400 ml-4">{{ t()('reserve.notes') }}</label>
          <textarea [(ngModel)]="form.notes" name="notes" class="w-full p-5 rounded-2xl bg-white border border-stone-100 shadow-sm"></textarea>
        </div>

        <button class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl">
          {{ t()('reserve.submit') }}
        </button>
      </form>
    </div>

    <app-reservation-chat [branchId]="form.branch_id || 1" />
  `
})
export default class ReservePage {
  private api = inject(ApiService);
  i18n = inject(I18nService);
  t = this.i18n.t;
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
      next: () => alert(this.t()('reserve.success')),
      error: () => alert(this.t()('reserve.unavailable'))
    });
  }
}
