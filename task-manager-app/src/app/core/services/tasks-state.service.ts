import { Injectable, signal, computed } from '@angular/core';
import { Task } from '@core/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksStateService {
  readonly tasks = signal<Task[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly tasksStats = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      inprogress: tasks.filter((task) => task.status === 'inprogress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    };
  });

  setTasks(tasks: Task[]): void {
    this.tasks.set(tasks);
  }

  addTask(task: Task): void {
    const currentTasks = this.tasks();
    this.tasks.set([...currentTasks, task]);
  }

  updateTask(updatedTask: Task): void {
    const currentTasks = this.tasks();
    const updatedTasks = currentTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasks.set(updatedTasks);
  }

  removeTask(taskId: string): void {
    const currentTasks = this.tasks();
    this.tasks.set(currentTasks.filter((task) => task.id !== taskId));
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}
