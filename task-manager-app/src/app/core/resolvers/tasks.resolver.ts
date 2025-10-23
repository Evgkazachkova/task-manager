import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Task } from '@app/core/models/task.model';
import { TasksApiService } from '@app/core/services/tasks-api.service';

export const TasksResolver: ResolveFn<Task[]> = () => {
  return inject(TasksApiService).getTasks();
};
