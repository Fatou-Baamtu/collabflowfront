import { Routes } from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {TaskListComponent} from './components/task/task-list.component';
import {ProjectListComponent} from './components/project/project-list.component';
import {authGuard} from './core/guard/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
   { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/:projectId',
    component: TaskListComponent,
    canActivate: [authGuard]
  },
   { path: '**', redirectTo: 'login' }
];
