import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TasksService } from '@app/core/services/tasks.service';
import { Task } from '@app/core/models/task.model';

@Component({
  selector: 'tm-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private readonly tasksService = inject(TasksService);

  tasks$ = this.tasksService.tasks$;

  editTask(taskId: string) {}

  deleteTask(taskId: string) {}

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
