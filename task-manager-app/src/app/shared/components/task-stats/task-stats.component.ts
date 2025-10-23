import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TasksStats } from '@app/core/models/task.model';

@Component({
  selector: 'tm-task-stats',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.scss',
})
export class TaskStatsComponent {
  tasksStats = input<TasksStats | null>(null);
  statusFilter = input<string | null>(null);

  statusFilterChange = output<string | null>();

  filterByStatus(status: string | null): void {
    this.statusFilterChange.emit(status);
  }

  clearStatusFilter(): void {
    this.statusFilterChange.emit(null);
  }

  isStatusFilterActive(status: string): boolean {
    return this.statusFilter() === status;
  }
}
