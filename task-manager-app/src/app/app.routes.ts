import { Routes } from '@angular/router';
import { TasksResolver } from '@app/core/resolvers/tasks.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./layout/layout-component/layout.component').then(
        (m) => m.LayoutComponent
      ),
    resolve: { tasks: TasksResolver },
  },
];
