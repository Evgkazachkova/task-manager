import { TaskStatus } from '@core/models/task-status.enum';

export class TaskStatusUtils {
  static getStatusLabel(status: TaskStatus): string {
    const statusLabels: Record<TaskStatus, string> = {
      [TaskStatus.todo]: 'К выполнению',
      [TaskStatus.inprogress]: 'В процессе',
      [TaskStatus.completed]: 'Завершено',
    };
    return statusLabels[status] || status;
  }

  static getStatusOptions(): Array<{ value: TaskStatus; label: string }> {
    return [
      { value: TaskStatus.todo, label: this.getStatusLabel(TaskStatus.todo) },
      {
        value: TaskStatus.inprogress,
        label: this.getStatusLabel(TaskStatus.inprogress),
      },
      {
        value: TaskStatus.completed,
        label: this.getStatusLabel(TaskStatus.completed),
      },
    ];
  }
}
