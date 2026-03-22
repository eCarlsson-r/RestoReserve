import { signal, computed } from '@angular/core';

export const cart = signal<any[]>([]);

export const cartCount = computed(() => 
  cart().reduce((acc, item) => acc + item.qty, 0)
);

export const cartTotal = computed(() => 
  cart().reduce((acc, item) => acc + (item.price * item.qty), 0)
);

export function addToCart(product: any) {
  const items = cart();
  // Matching the keys from the service response or component mapping
  const index = items.findIndex(i => i.code === product['product-code'] || i.code === product.id);
  
  if (index > -1) {
    items[index].qty++;
    cart.set([...items]);
  } else {
    cart.set([...items, { 
      code: product['product-code'] || product.id, 
      name: product['product-name'] || product.name, 
      price: product['product-price'] || product.price, 
      qty: 1 
    }]);
  }
}

export function clearCart() {
  cart.set([]);
}