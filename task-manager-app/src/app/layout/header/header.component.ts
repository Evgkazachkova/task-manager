import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { LoadingIndicatorComponent } from '@app/shared/components/loading-indicator/loading-indicator.component';

@Component({
  selector: 'tm-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, LoadingIndicatorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }
}
