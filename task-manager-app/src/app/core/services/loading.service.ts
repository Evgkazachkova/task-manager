import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly requestCount = signal(0);

  readonly isLoading = computed(() => this.requestCount() > 0);

  startLoading(): void {
    this.requestCount.update((count) => count + 1);
  }

  stopLoading(): void {
    this.requestCount.update((count) => Math.max(0, count - 1));
  }
}
