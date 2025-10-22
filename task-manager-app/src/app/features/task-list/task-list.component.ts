import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TasksService } from '@app/core/services/tasks.service';
import { Task } from '@app/core/models/task.model';
import { TaskStatus } from '@app/core/models/task-status.enum';
import { TaskStatusUtils } from '@app/core/utils/task-status.utils';

@Component({
  selector: 'tm-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);

  tasks$ = this.tasksService.tasks$;

  editTask(taskId: string): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: string) {}

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  getStatusLabel(status: TaskStatus): string {
    return TaskStatusUtils.getStatusLabel(status);
  }
}
