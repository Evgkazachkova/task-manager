import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CreateTaskType, Task, UpdateTaskType } from '@core/models/task.model';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@app/core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  readonly tasks = signal<Task[]>([]);
  readonly searchQuery = signal<string>('');
  readonly statusFilter = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);

  readonly filteredTasks = computed(() => {
    const tasks = this.tasks();
    const searchQuery = this.searchQuery();
    const statusFilter = this.statusFilter();
    return this.filterTasks(tasks, searchQuery, statusFilter);
  });

  readonly tasksStats = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inprogress: tasks.filter((task) => task.status === 'inprogress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    };
  });

  getTasks(): Observable<Task[]> {
    this.isLoading.set(true);

    return this.httpClient
      .get<Task[]>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`)
      .pipe(
        tap((tasks) => {
          this.tasks.set(tasks);
          this.isLoading.set(false);
        })
      );
  }

  getTaskById(id: string): Observable<Task> {
    this.isLoading.set(true);

    return this.httpClient
      .get<Task>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(tap(() => this.isLoading.set(false)));
  }

  createTask(task: CreateTaskType): Observable<void> {
    this.isLoading.set(true);

    return this.httpClient
      .post<void>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`, task)
      .pipe(tap(() => this.isLoading.set(false)));
  }

  updateTask(id: string, task: UpdateTaskType): Observable<void> {
    this.isLoading.set(true);

    return this.httpClient
      .put<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`, task)
      .pipe(tap(() => this.isLoading.set(false)));
  }

  deleteTask(id: string): Observable<void> {
    this.isLoading.set(true);

    return this.httpClient
      .delete<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(
        tap(() => {
          const currentTasks = this.tasks();
          this.tasks.set(currentTasks.filter((task) => task.id !== id));
          this.isLoading.set(false);
        })
      );
  }

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

  private filterTasks(
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
}
