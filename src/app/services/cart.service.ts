import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from 'src/types';

export interface CartItem {
  id: number;
  name: string;
  price: number; // The original ala carte price
  is_buffet_eligible: boolean;
  quantity: number;
  image_url: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  // 1. The Session State (From Reservation/Check-in)
  // This tells us if they are currently "In a Buffet"
  currentSession = signal<{
    is_buffet: boolean;
    reservation_id?: number;
    tier_name?: string;
    expires_at?: Date;
  } | null>(null);

  // 2. The Items in the Basket
  items = signal<CartItem[]>([]);

  // 3. Computed Totals (The "Magic" part)
  total = computed(() => {
    return this.items().reduce((sum, item) => {
      // If Buffet is active and item is eligible, price is 0
      const effectivePrice = (this.currentSession()?.is_buffet && item.is_buffet_eligible) 
        ? 0 
        : item.price;
      
      return sum + (effectivePrice * item.quantity);
    }, 0);
  });

  // 4. Methods
  addToCart(product: Product) {
    this.items.update(current => {
      const existing = current.find(i => i.id === product.id);
      if (existing) {
        return current.map(i => i.id === product.id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...current, { 
        id: product.id, 
        name: product.name, 
        price: product.price,
        is_buffet_eligible: product.is_buffet_eligible,
        image_url: product.files?.[0]?.url || '',
        quantity: 1 
      }];
    });
  }

  createOrder(orderData: any) {
    return this.http.post('/api/orders', orderData);
  }
}