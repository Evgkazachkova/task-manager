import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showNotification(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Закрыть', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
    });
  }
}
