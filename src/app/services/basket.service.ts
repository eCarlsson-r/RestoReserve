import { computed, signal } from "@angular/core";
import { Product } from "./product.service";

export class BasketService {
  basket = signal<Product[]>([]);

  // Total amount the customer actually has to pay extra
  alaCarteTotal = computed(() => {
    return this.basket().reduce((sum, item) => sum + (item.price || 0), 0);
  });

  // Count of AYCE items (for kitchen metrics)
  ayceCount = computed(() => {
    return this.basket().filter(item => item.price === 0).length;
  });

  addToBasket(product: Product) {
    this.basket.update(items => [...items, product]);
  }

  removeFromBasket(product: Product) {
    this.basket.update(items => items.filter(item => item.id !== product.id));
  }
}