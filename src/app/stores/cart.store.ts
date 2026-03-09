import { signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const cart = signal<any[]>([]);

export const cartCount = computed(() => 
  cart().reduce((acc, item) => acc + item.qty, 0)
);

export const cartTotal = computed(() => 
  cart().reduce((acc, item) => acc + (item.price * item.qty), 0)
);

export function addToCart(product: any) {
  const items = cart();
  const index = items.findIndex(i => i.code === product['product-code']);
  
  if (index > -1) {
    items[index].qty++;
    cart.set([...items]);
  } else {
    cart.set([...items, { 
      code: product['product-code'], 
      name: product['product-name'], 
      price: product['product-price'], 
      qty: 1 
    }]);
  }
}

export async function submitFinalOrder(tableId: string) {
  const orderPayload = {
    'sales-branch': 'DMBRC',
    'table-number': tableId,
    'floor-number': 1,
    'sales-customer': 1, // Guest
    'items': cart().map(item => ({
      'item-code': item.code,
      'item-price': item.price,
      'item-note': item.note || '',
      'qty': item.qty
    }))
  };

  // POST to Laravel
  return firstValueFrom(http.post('/api/customer/submit-order', orderPayload));
}