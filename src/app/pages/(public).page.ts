import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../guards/guest.guard';

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-stone-50">
      <nav class="p-6 flex justify-between items-center bg-white shadow-sm">
        <a routerLink="/" class="font-display text-2xl italic text-brand-dark">RV</a>
        <a routerLink="/login" class="text-[10px] font-black uppercase border-b-2 border-brand-primary pb-1">Member Login</a>
      </nav>
      
      <router-outlet />
    </div>
  `,
})
export default class PublicLayout {}