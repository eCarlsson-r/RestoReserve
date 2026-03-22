import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../guards/guest.guard';

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="mx-auto min-h-screen bg-brand-dark flex items-center justify-center p-6">
      <router-outlet />
    </div>
  `,
})
export default class AuthLayout {}