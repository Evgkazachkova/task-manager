import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'tm-loading-indicator',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss',
})
export class LoadingIndicatorComponent {
  readonly loadingService = inject(LoadingService);
}
