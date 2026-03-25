import { ApiService } from './api.service';
import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { BuffetPackage, Product } from 'src/types';
import { ToastService } from './toast.service';

export interface Session {
  branch_slug: string;
  branch_name: string;
  table_id: string;
  table_number: string;
  floor_number: string;
  is_buffet: boolean;
  buffet?: BuffetPackage;
  reservation_id?: number; // Null for Scenario B (Walk-in)
  start_time: Date;
  expires_at?: Date;    // Calculated: start_time + buffet.duration
}

export interface CartItem {
  type: string;
  id: number;
  name: string;
  price: number; // The original ala carte price
  quantity: number;
  image_url: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  // 1. The Session State (From Reservation/Check-in)
  // This tells us if they are currently "In a Buffet"
  currentSession = signal<Session | null>(null);
  // Store the end time as a Date object
  endTime = signal<Date | null>(null);
  currentTime = signal(new Date());
  
  // Computed helper to check if we are in a specific branch
  activeBranch = computed(() => this.currentSession()?.branch_slug);

  // 2. The Items in the Basket
  items = signal<CartItem[]>([]);

  // Reactive calculation of remaining seconds
  remainingSeconds = computed(() => {
    const end = this.endTime();
    if (!end) return null;
    const diff = Math.floor((end.getTime() - this.currentTime().getTime()) / 1000);
    return diff > 0 ? diff : 0;
  });

  // Format as MM:SS
  formattedTime = computed(() => {
    const total = this.remainingSeconds();
    if (total === null) return '';
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  constructor() {
    // Update current time every second
    setInterval(() => this.currentTime.set(new Date()), 1000);

    effect(() => {
      const seconds = this.remainingSeconds();
      if (seconds === 600) {
        this.toast.show("Final Call: 10 minutes remaining", "warning");
      } else if (seconds === 0) {
        this.toast.show("Buffet Session Expired", "error");
      }
    });
  }

  setSession(sale: any) {
    // Calculate end time: Start Time + Duration
    const start = new Date(`${sale.date}T${sale.time}`);
    const end = new Date(start.getTime() + sale.duration_minutes * 60000);
    this.endTime.set(end);
  }

  includedIds = computed(() => {
    const products = this.currentSession()?.buffet?.products || [];
    return new Set(products.map(p => p.id));
  });

  isProductIncluded(productId: number): boolean {
    const session = this.currentSession();
    if (!session || !session.is_buffet) return false;
    return this.includedIds().has(productId);
  }

  // 3. Computed Totals (The "Magic" part)
  total = computed(() => {
    return this.items().reduce((sum, item) => {
      // If Buffet is active and item is eligible, price is 0
      const effectivePrice = this.isProductIncluded(item.id) ? 0 : item.price;
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
        type: "product",
        id: product.id, 
        name: product.name, 
        price: product.price,
        image_url: product.files?.[0]?.url || '',
        quantity: 1 
      }];
    });
  }

  upgradeToBuffet(reservationId: number, buffet: BuffetPackage) {
    this.currentSession.update(session => {
      if (!session) return null;
      this.endTime.set(new Date(session.start_time.getTime() + buffet.duration_minutes * 60 * 1000));
      return {
        ...session,
        is_buffet: true,
        reservation_id: reservationId,
        buffet: buffet,
        expires_at: new Date(session.start_time.getTime() + buffet.duration_minutes * 60 * 1000)
      };
    });

    this.items.update(items => items.map(item => (this.isProductIncluded(item.id)) ? {
      ...item,
      price: 0,
    } : item));
  }

  createOrder() {
    return this.api.post('orders', {
      branch: this.currentSession()?.branch_slug,
      table: this.currentSession()?.table_id,
      items: this.items(),
      total: this.total(),
      reservation_id: this.currentSession()?.reservation_id
    });
  }
}