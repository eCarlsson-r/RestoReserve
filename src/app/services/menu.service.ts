// src/app/services/menu.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';

export interface CallWaiterRequest {
  table: string | number;
  branch: string;
  type: 'ASSISTANCE' | 'BILL';
}

export interface OrderItem {
  'item-code': string | number;
  'item-price': number;
  'item-note'?: string;
  'quantity': number;
}

export interface OrderRequest {
  'sales-branch': string;
  'table-number': string | number;
  'floor-number': number;
  'sales-customer': number;
  'items': OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private api = inject(ApiService);

  // Signals for high-performance reactivity
  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  isLoading = signal(false);

  loadHome() {
    return this.api.get<any>(`home`);
  }

  getBranchCategories(slug: string) {
    return this.api.get<any>(`branches/${slug}/categories`);
  }

  getCategoryProducts(branch: string, category: string) {
    return this.api.get<any>(`products?branch=${branch}&category=${category}`);
  }

  getBranchBuffets(slug: string) {
    return this.api.get<any>(`branches/${slug}/buffets`);
  }

  /**
   * Semantically named method for calling a waiter
   * (HumanDesign style)
   */
  callWaiter(req: CallWaiterRequest) {
    return this.api.post(`call-waiter`, req);
  }
}