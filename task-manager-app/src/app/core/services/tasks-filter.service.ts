import { Injectable, signal } from '@angular/core';
import { Task } from '@core/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksFilterService {
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string | null>(null);

  setSearchQuery(query: string): void {
    this.searchQuery.set(query.trim());
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  setStatusFilter(status: string | null): void {
    this.statusFilter.set(status);
  }

  clearStatusFilter(): void {
    this.statusFilter.set(null);
  }

  filterTasks(
    tasks: Task[],
    searchQuery: string,
    statusFilter: string | null = null
  ): Task[] {
    let filteredTasks = tasks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    return filteredTasks;
  }

  getFilteredTasks(tasks: Task[]): Task[] {
    return this.filterTasks(tasks, this.searchQuery(), this.statusFilter());
  }
}
