import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, Branch } from '../../types';

/**
 * Response Interface for branch catalog
 */
export interface BranchCatalogResponse {
  categories: Category[];
  products: Product[];
  branchName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; 

  // Signals for global reactivity across components
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);

  /**
   * Fetches the complete menu for a branch (products + categories)
   * Using HumanDesign semantic naming style
   */
  getProducts(slug: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${slug}`);
  }

  /**
   * Fetch specific product details if needed
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/item/${id}`);
  }

  /**
   * Fetch featured products for the landing page
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Fetch active branches for the landing page
   */
  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`);
  }
}
