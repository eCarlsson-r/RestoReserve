// src/app/services/menu.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = 'https://your-api.com/api/customer';

  // Signals for high-performance reactivity
  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  isLoading = signal(false);

  loadMenuData(branchCode: string) {
    this.isLoading.set(true);
    // Fetch both for a faster initial load
    return this.http.get<{categories: any[], products: any[]}>(
      `${this.apiUrl}/menu/${branchCode}`
    ).pipe(
      tap(data => {
        this.categories.set(data.categories);
        this.products.set(data.products);
        this.isLoading.set(false);
      })
    );
  }
}