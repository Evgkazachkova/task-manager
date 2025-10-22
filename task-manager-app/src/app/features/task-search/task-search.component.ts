import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TasksService } from '@app/core/services/tasks.service';

@Component({
  selector: 'tm-task-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './task-search.component.html',
  styleUrl: './task-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSearchComponent {
  private readonly tasksService = inject(TasksService);

  searchQuery = '';

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.searchQuery = query;
    this.tasksService.setSearchQuery(query);
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.tasksService.clearSearch();
  }
}
