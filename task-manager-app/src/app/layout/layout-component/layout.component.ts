import { Component } from '@angular/core';
import { TaskSearchComponent } from '@app/features/task-search/task-search.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { TaskListComponent } from '@app/features/task-list/task-list.component';

@Component({
  selector: 'tm-layout',
  imports: [HeaderComponent, TaskSearchComponent, TaskListComponent],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
