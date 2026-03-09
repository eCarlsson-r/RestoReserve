// src/app/pages/table/tracker.component.ts
import { Component, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-tracker',
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-slate-50 rounded-[2.5rem] mt-8">
      <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Live Order Status</h3>
      
      <div class="space-y-6">
        <div *ngFor="let item of orderItems()" class="flex items-center gap-4">
          <div [ngClass]="{
            'bg-amber-500': item.status === 'O',
            'bg-blue-500 animate-pulse': item.status === 'P',
            'bg-emerald-500': item.status === 'D'
          }" class="w-3 h-3 rounded-full"></div>
          
          <div class="flex-1">
            <p class="text-sm font-black uppercase italic">{{ item.name }}</p>
            <p class="text-[10px] font-bold text-slate-400 uppercase">
              {{ getStatusLabel(item.status) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderTracker {
  http = inject(HttpClient);
  orderItems = signal<any[]>([]);

  constructor() {
    // Start polling when component loads
    this.refreshStatus();
    setInterval(() => this.refreshStatus(), 15000);
  }

  refreshStatus() {
    this.http.get<any[]>('/api/customer/my-order-status').subscribe(data => {
      this.orderItems.set(data);
    });
  }

  getStatusLabel(status: string) {
    const labels: any = { 'O': 'Order Received', 'P': 'Chef is Cooking', 'D': 'Served' };
    return labels[status] || 'Processing';
  }
}