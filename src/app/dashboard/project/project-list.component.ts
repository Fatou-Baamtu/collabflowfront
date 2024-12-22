// project-list.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {Project} from '../../core/interfaces/project.interface';
import {User} from '../../core/interfaces/user.interface';
import {ProjectService} from '../../core/services/project.service';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Mes Projets</h1>
        <div class="flex gap-4 mb-4">
          <button
            [class.bg-blue-500]="!showOnlyMyProjects()"
            [class.bg-gray-300]="showOnlyMyProjects()"
            class="px-4 py-2 rounded text-white"
            (click)="toggleProjectView(false)">
            Tous les Projets
          </button>
          <button
            [class.bg-blue-500]="showOnlyMyProjects()"
            [class.bg-gray-300]="!showOnlyMyProjects()"
            class="px-4 py-2 rounded text-white"
            (click)="toggleProjectView(true)">
            Mes Projets
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let project of projects()"
             class="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
             (click)="selectProject(project)">
          <h3 class="text-xl font-semibold mb-2">{{project.name}}</h3>
          <p class="text-gray-600 mb-2">{{project.description}}</p>
          <div class="flex justify-between items-center">
            <span [class]="getPriorityClass(project.priority)">
              {{project.priority}}
            </span>
            <span class="text-sm text-gray-500">
              {{project.members?.length || 0}} membres
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectListComponent {
  projects = signal<Project[]>([]);
  showOnlyMyProjects = signal<boolean>(true);
  currentUser: User | null = null;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
  private router: Router // Injectez le Router ici

) {
    // Combine les observables du user courant et des projets
    combineLatest([
      this.userService.currentUser$,
      this.projectService.getAll()
    ]).pipe(
      map(([user, response]) => {
        this.currentUser = user;
        if (response.success) {
          if (this.showOnlyMyProjects()) {
            return response.data.filter(project =>
              project.members?.some(member => member.user.id === user?.id)
            );
          }
          return response.data;
        }
        return [];
      })
    ).subscribe(projects => {
      this.projects.set(projects);
    });
  }

  toggleProjectView(showOnlyMine: boolean) {
    this.showOnlyMyProjects.set(showOnlyMine);
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAll().subscribe(response => {
      if (response.success) {
        const projects = response.data;
        if (this.showOnlyMyProjects()) {
          this.projects.set(
            projects.filter(project =>
              project.members?.some(member =>
                member.user.id === this.currentUser?.id
              )
            )
          );
        } else {
          this.projects.set(projects);
        }
      }
    });
  }

  selectProject(project: Project) {
    this.router.navigate(['/dashboard', project.id]);
  }


  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT':
        return 'text-red-500 font-semibold';
      case 'NORMAL':
        return 'text-blue-500';
      case 'LOW':
        return 'text-green-500';
      default:
        return '';
    }
  }
}
