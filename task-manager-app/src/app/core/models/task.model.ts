import { FormControl } from '@angular/forms';
import { TaskStatus } from '@app/core/models/task-status.enum';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
}

export interface TaskForm {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<TaskStatus>;
}

export interface TasksStats {
  total: number;
  todo: number;
  inprogress: number;
  completed: number;
}

export type CreateTaskType = {
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
};

export type UpdateTaskType = Partial<CreateTaskType>;
