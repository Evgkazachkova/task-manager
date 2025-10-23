import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CreateTaskType, Task, UpdateTaskType } from '@core/models/task.model';
import { environment } from '@environments/environment';
import { API_ENDPOINTS } from '@app/core/constants/api.constants';
import { TasksStateService } from './tasks-state.service';

@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly tasksStateService = inject(TasksStateService);

  getTasks(): Observable<Task[]> {
    this.tasksStateService.setLoading(true);

    return this.httpClient
      .get<Task[]>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`)
      .pipe(
        tap((tasks) => {
          this.tasksStateService.setTasks(tasks);
          this.tasksStateService.setLoading(false);
        })
      );
  }

  getTaskById(id: string): Observable<Task> {
    this.tasksStateService.setLoading(true);

    return this.httpClient
      .get<Task>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(tap(() => this.tasksStateService.setLoading(false)));
  }

  createTask(task: CreateTaskType): Observable<void> {
    this.tasksStateService.setLoading(true);

    return this.httpClient
      .post<void>(`${this.baseUrl}${API_ENDPOINTS.TASKS}`, task)
      .pipe(tap(() => this.tasksStateService.setLoading(false)));
  }

  updateTask(id: string, task: UpdateTaskType): Observable<void> {
    this.tasksStateService.setLoading(true);

    return this.httpClient
      .put<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`, task)
      .pipe(tap(() => this.tasksStateService.setLoading(false)));
  }

  deleteTask(id: string): Observable<void> {
    this.tasksStateService.setLoading(true);

    return this.httpClient
      .delete<void>(`${this.baseUrl}${API_ENDPOINTS.TASK_BY_ID(id)}`)
      .pipe(
        tap(() => {
          this.tasksStateService.removeTask(id);
          this.tasksStateService.setLoading(false);
        })
      );
  }
}
