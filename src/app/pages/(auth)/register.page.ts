import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouteMeta } from '@analogjs/router';
import { guestGuard } from '../../guards/guest.guard';

export const routeMeta: RouteMeta = {
  canActivate: [guestGuard],
};

@Component({
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="min-h-screen p-10">
            <h2 class="font-display text-4xl italic mb-8">Join the Club</h2>
            
            <form class="space-y-6">
                <input type="text" placeholder="Full Name" class="w-full p-4 rounded-2xl border-stone-100 border">
                <input type="text" placeholder="Username" class="w-full p-4 rounded-2xl border-stone-100 border">
                
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase text-slate-400 ml-4">Date of Birth</label>
                    <input type="date" [(ngModel)]="birthday" name="birthday" 
                            class="w-full p-4 rounded-2xl border-stone-100 border font-bold">
                    <p class="text-[9px] text-brand-primary font-bold px-4">
                        * We'll send you a free buffet gift on this day!
                    </p>
                </div>

                <input type="password" placeholder="Password" class="w-full p-4 rounded-2xl border-stone-100 border">
                
                <button class="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase italic shadow-xl shadow-brand-primary/20">
                Create Account
                </button>
            </form>
        </div>
    `
})
export default class RegisterPage { birthday = ''; }