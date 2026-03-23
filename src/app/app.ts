import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50 selection:bg-brand-primary/10">
      <nav class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-stone-100 px-4 md:px-12 py-5 flex justify-between items-center">
        <a routerLink="/" class="font-display text-2xl italic tracking-tighter text-brand-dark">Red Velvet</a>
        <div class="flex gap-4 md:gap-8 items-center">
          <a routerLink="/login" class="text-[10px] font-black uppercase italic border-b-2 border-brand-primary/20 hover:border-brand-primary pb-1 transition-all">Login</a>
        </div>
      </nav>

      <main class="grow w-screen">
        <router-outlet />
      </main>

      <footer class="p-12 text-center border-t border-stone-100 bg-white">
        <p class="text-[10px] font-black uppercase tracking-[0.5em] text-stone-300">© 2026 Red Velvet Group</p>
      </footer>
    </div>
  `
})
export class App {}
