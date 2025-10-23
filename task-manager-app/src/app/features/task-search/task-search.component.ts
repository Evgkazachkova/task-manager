import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TasksFilterService } from '@app/core/services/tasks-filter.service';

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
})
export class TaskSearchComponent {
  private readonly tasksFilterService = inject(TasksFilterService);

  readonly searchQuery = this.tasksFilterService.searchQuery;
  readonly hasSearchQuery = computed(() => this.searchQuery().length > 0);

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value;
    this.tasksFilterService.setSearchQuery(query);
  }

  onClearSearch(): void {
    this.tasksFilterService.clearSearch();
  }
}
