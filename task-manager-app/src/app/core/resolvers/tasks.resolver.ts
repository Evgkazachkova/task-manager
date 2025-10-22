import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Task } from '@app/core/models/task.model';
import { TasksService } from '@app/core/services/tasks.service';

export const TasksResolver: ResolveFn<Task[]> = () => {
  return inject(TasksService).getTasks();
};
