// src/app/services/menu.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from 'src/types';

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
  private http = inject(HttpClient);
  private apiUrl = '/api';

  // Signals for high-performance reactivity
  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  isLoading = signal(false);

  loadHome() {
    return this.http.get<any>(`${this.apiUrl}/home`);
  }

  getBranchCategories(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/branches/${slug}/categories`);
  }

  getCategoryProducts(branch: string, category: string) {
    return this.http.get<any>(`${this.apiUrl}/products?branch=${branch}&category=${category}`);
  }

  /**
   * Semantically named method for calling a waiter
   * (HumanDesign style)
   */
  callWaiter(req: CallWaiterRequest) {
    return this.http.post(`${this.apiUrl}/call-waiter`, req);
  }

  /**
   * Submit an order to the kitchen/system
   * (HumanDesign style)
   */
  submitOrder(order: OrderRequest) {
    return this.http.post(`${this.apiUrl}/submit-order`, order);
  }
}