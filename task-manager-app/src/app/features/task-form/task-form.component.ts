import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import {
  CreateTaskType,
  TaskForm,
  UpdateTaskType,
} from '@core/models/task.model';
import { TaskStatus } from '@core/models/task-status.enum';
import { TasksService } from '@core/services/tasks.service';
import { TaskStatusUtils } from '@core/utils/task-status.utils';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '@core/services/notification.service';
import { take, tap, catchError, of } from 'rxjs';
import { minLengthCustom } from '@app/core/validators/custom-validators';

@Component({
  selector: 'tm-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  readonly statusOptions = TaskStatusUtils.getStatusOptions();

  taskFormGroup: FormGroup<TaskForm> = this.fb.nonNullable.group({
    title: ['', [Validators.required, minLengthCustom(3)]],
    description: [''],
    status: [TaskStatus.todo],
  });

  readonly isEditMode = this.getTaskIdFromRoute() !== null;
  readonly pageTitle = this.isEditMode
    ? 'Редактирование задачи'
    : 'Создание задачи';

  get titleControl() {
    return this.taskFormGroup.get('title');
  }

  ngOnInit(): void {
    this.loadTaskIfEditMode();
  }

  private getTaskIdFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private loadTaskIfEditMode(): void {
    const taskId = this.getTaskIdFromRoute();
    if (!taskId) return;

    this.tasksService
      .getTaskById(taskId)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('Error loading task:', error);
          this.notificationService.showNotification(
            'Ошибка при загрузке задачи'
          );
          return of(null);
        })
      )
      .subscribe((task) => {
        if (task) {
          this.taskFormGroup.patchValue({
            title: task.title,
            description: task.description || '',
            status: task.status,
          });
        }
      });
  }

  onSubmit(): void {
    if (this.taskFormGroup.invalid) {
      return;
    }

    this.saveTask(this.taskFormGroup.value);
  }

  private saveTask(taskData: UpdateTaskType | CreateTaskType): void {
    const taskId = this.getTaskIdFromRoute();

    const operation = taskId
      ? this.tasksService.updateTask(taskId, taskData as UpdateTaskType)
      : this.tasksService.createTask({
          ...taskData,
          createdAt: new Date(),
        } as CreateTaskType);

    operation
      .pipe(
        take(1),
        tap(() => {
          const message = taskId
            ? 'Задача успешно обновлена'
            : 'Задача успешно создана';
          this.notificationService.showNotification(message);
          this.router.navigate(['/tasks']);
        }),
        catchError((error) => {
          console.error('Error saving task:', error);
          const message = taskId
            ? 'Ошибка при обновлении задачи'
            : 'Ошибка при создании задачи';
          this.notificationService.showNotification(message);
          return of(null);
        })
      )
      .subscribe();
  }

  onCancel(): void {
    if (this.taskFormGroup.dirty) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        width: '400px',
        data: {
          title: 'Несохраненные изменения',
          message:
            'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?',
        },
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/tasks']);
          }
        });
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}
