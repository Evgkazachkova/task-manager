import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { TasksApiService } from '@app/core/services/tasks-api.service';
import { TasksStateService } from '@app/core/services/tasks-state.service';
import { TasksFilterService } from '@app/core/services/tasks-filter.service';
import { TaskStatus } from '@app/core/models/task-status.enum';
import { TaskStatusUtils } from '@app/core/utils/task-status.utils';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '@app/core/services/notification.service';
import { TaskStatsComponent } from '@app/shared/components/task-stats/task-stats.component';
import { take } from 'rxjs';

@Component({
  selector: 'tm-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TaskStatsComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  private readonly tasksApiService = inject(TasksApiService);
  private readonly tasksStateService = inject(TasksStateService);
  private readonly tasksFilterService = inject(TasksFilterService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  readonly tasks = computed(() => {
    const allTasks = this.tasksStateService.tasks();
    return this.tasksFilterService.getFilteredTasks(allTasks);
  });
  readonly isLoading = this.tasksStateService.isLoading;
  readonly tasksStats = this.tasksStateService.tasksStats;
  readonly statusFilter = this.tasksFilterService.statusFilter;

  readonly hasTasks = computed(() => this.tasks().length > 0);

  editTask(taskId: string): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
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
          this.tasksApiService
            .deleteTask(taskId)
            .pipe(take(1))
            .subscribe(() => {
              this.notificationService.showNotification(
                'Задача успешно удалена'
              );
            });
        }
      });
  }

  getStatusLabel(status: TaskStatus): string {
    return TaskStatusUtils.getStatusLabel(status);
  }

  onStatusFilterChange(status: string | null): void {
    this.tasksFilterService.setStatusFilter(status);
  }
}
