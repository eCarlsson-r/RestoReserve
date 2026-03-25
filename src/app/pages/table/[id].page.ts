import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-brand-dark">
      <div class="text-center space-y-4">
        <div class="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="font-display italic text-white text-xl">Setting your table...</p>
      </div>
    </div>
  `
})
export default class TablePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cart = inject(CartService);
  private api = inject(ApiService);

  ngOnInit() {
    const tableId = this.route.snapshot.paramMap.get('id');
    this.api.get(`table/${tableId}`).subscribe((data: any) => {
      if (data.branch.slug && tableId) {
        // 1. Initialize the Session (Scenario B: Default to Ala Carte)
        this.cart.currentSession.set({
          branch_slug: data.branch.slug,
          branch_name: data.branch.name,
          table_id: tableId,
          table_number: data.table_number,
          floor_number: data.floor_number,
          is_buffet: false, // Walk-ins start as Ala Carte
          start_time: new Date(),
          buffet: undefined, // Add this to match the Interface structure exactly
          reservation_id: undefined,
          expires_at: undefined
        });

        // 2. Redirect to that specific branch's menu
        this.router.navigate(['/', data.branch.slug]);
      } else {
        this.router.navigate(['/']); // Fallback to branch selector
      }
    });
  }
}