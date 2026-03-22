import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouteMeta } from '@analogjs/router';
import { authGuard } from '../guards/auth.guard';

export const routeMeta: RouteMeta = {
  canActivate: [authGuard]
};

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-white">
      <main class="pb-24">
        <router-outlet />
      </main>

      <nav class="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-stone-100 px-6 py-4 flex justify-around items-center z-50">
        <a routerLink="/dashboard" class="flex flex-col items-center gap-1 text-brand-primary">
          <span class="text-[10px] font-black uppercase italic">Home</span>
        </a>
        <a routerLink="/rewards" class="flex flex-col items-center gap-1 text-stone-400">
          <span class="text-[10px] font-black uppercase italic">Points</span>
        </a>
      </nav>
    </div>
  `,
})
export default class CustomerLayout {
    private authService = inject(AuthService);
    user = this.authService.user;
}