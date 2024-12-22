import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProjectListComponent} from './dashboard/project/project-list.component';
import {SubtaskListComponent} from './dashboard/task/subtask-list.component';

export const routes: Routes = [
  { path: 'login', component: SubtaskListComponent },
  { path: 'dashboard', component: DashboardComponent },

];
