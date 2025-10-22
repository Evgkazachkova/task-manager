import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { Task } from '@core/models/task.model';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@app/core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private tasksCache$ = new BehaviorSubject<Task[]>([]);
  private loadingState$ = new BehaviorSubject<boolean>(false);
  private searchQuery$ = new BehaviorSubject<string>('');

  get tasks$(): Observable<Task[]> {
    return combineLatest([
      this.tasksCache$.asObservable(),
      this.searchQuery$.pipe(debounceTime(300)),
    ]).pipe(
      map(([tasks, searchQuery]) => this.filterTasks(tasks, searchQuery))
    );
  }

  get loading$(): Observable<boolean> {
    return this.loadingState$.asObservable();
  }

  getTasks(): Observable<Task[]> {
    this.loadingState$.next(true);
    return this.httpClient
      .get<Task[]>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`)
      .pipe(
        tap((tasks) => {
          this.tasksCache$.next(tasks);
          this.loadingState$.next(false);
        })
        // TODO написать обработку ошибок
      );
  }

  getTaskById(id: string): Observable<Task> {
    this.loadingState$.next(true);

    return this.httpClient
      .get<Task>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(tap(() => this.loadingState$.next(false)));
  }

  deleteTask(id: string): Observable<void> {
    this.loadingState$.next(true);

    return this.httpClient
      .delete<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksCache$.value;
          const filteredTasks = currentTasks.filter((task) => task.id !== id);
          this.tasksCache$.next(filteredTasks);
          this.loadingState$.next(false);
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
