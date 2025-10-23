import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { CreateTaskType, Task, UpdateTaskType } from '@core/models/task.model';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@app/core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private tasksCache$ = new BehaviorSubject<Task[]>([]);
  private searchQuery$ = new BehaviorSubject<string>('');

  get tasks$(): Observable<Task[]> {
    return combineLatest([
      this.tasksCache$.asObservable(),
      this.searchQuery$.pipe(debounceTime(300)),
    ]).pipe(
      map(([tasks, searchQuery]) => this.filterTasks(tasks, searchQuery))
    );
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient
      .get<Task[]>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`)
      .pipe(
        tap((tasks) => {
          this.tasksCache$.next(tasks);
        })
      );
  }

  getTaskById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(
      `${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`
    );
  }

  createTask(task: CreateTaskType): Observable<void> {
    return this.httpClient.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.TASKS}`,
      task
    );
  }

  updateTask(id: string, task: UpdateTaskType): Observable<void> {
    return this.httpClient.put<void>(
      `${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`,
      task
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksCache$.value;
          const filteredTasks = currentTasks.filter((task) => task.id !== id);
          this.tasksCache$.next(filteredTasks);
        })
      );
  }

  setSearchQuery(query: string): void {
    this.searchQuery$.next(query.trim());
  }

  clearSearch(): void {
    this.searchQuery$.next('');
  }

  private filterTasks(tasks: Task[], searchQuery: string): Task[] {
    if (!searchQuery) {
      return tasks;
    }

    const query = searchQuery.toLowerCase();
    return tasks.filter((task) => task.title.toLowerCase().includes(query));
  }
}
