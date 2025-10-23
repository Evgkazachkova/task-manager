import { Routes } from '@angular/router';
import { TasksResolver } from '@app/core/resolvers/tasks.resolver';
import { LayoutComponent } from '@app/layout/layout-component/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: LayoutComponent,
    resolve: { tasks: TasksResolver },
  },
  {
    path: 'tasks/create',
    loadComponent: () =>
      import('./features/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () =>
      import('./features/task-form/task-form.component').then(
        (m) => m.TaskFormComponent
      ),
  },
];
