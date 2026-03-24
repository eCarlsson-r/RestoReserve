import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const id = this.counter++;
    this.toasts.update(t => [...t, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.toasts.update(t => t.filter(toast => toast.id !== id));
    }, 5000);
  }
}