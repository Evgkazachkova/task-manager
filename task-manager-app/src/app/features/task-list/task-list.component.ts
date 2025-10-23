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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '@app/core/services/notification.service';
import { take } from 'rxjs';

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
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  tasks$ = this.tasksService.tasks$;

  editTask(taskId: string): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Вы уверены, что хотите удалить задачу?',
        message: 'Эта задача будет удалена безвозвратно.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.tasksService
            .deleteTask(taskId)
            .pipe(take(1))
            .subscribe(() => {
              this.notificationService.showNotification('Задача успешно удалена');
            });
        }
      });
  }

  trackByTaskId(task: Task): string {
    return task.id;
  }

  getStatusLabel(status: TaskStatus): string {
    return TaskStatusUtils.getStatusLabel(status);
  }
}
