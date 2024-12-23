import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { combineLatest, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Project } from '../../core/interfaces/project.interface';
import { User } from '../../core/interfaces/user.interface';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import {ProjectMember} from '../../core/interfaces/ProjectMemberInterface';

interface ProjectWithMembers extends Project {
  projectMembers?: ProjectMember[];
  memberCount?: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Mes Projets</h1>
          <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            (click)="createNewProject()">
            Nouveau Projet
          </button>
        </div>
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
             class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div class="cursor-pointer" (click)="selectProject(project)">
            <h3 class="text-xl font-semibold mb-2">{{project.name}}</h3>
            <p class="text-gray-600 mb-2">{{project.description}}</p>
            <div class="flex justify-between items-center mb-3">
              <span [class]="getPriorityClass(project.priority)">
                {{project.priority}}
              </span>
              <span class="text-sm text-gray-500">
                {{project.memberCount || 0}} membres
              </span>
            </div>
          </div>

          <!-- Section des membres si l'utilisateur est membre du projet -->
          <div *ngIf="isUserProjectMember(project)" class="border-t pt-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">Membres:</span>
              <button
                *ngIf="isUserProjectAdmin(project)"
                class="text-blue-500 hover:text-blue-700 text-sm"
                (click)="openManageMembers(project)">
                Gérer les membres
              </button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <div *ngFor="let member of project.projectMembers?.slice(0, 3)"
                   class="text-xs bg-gray-100 rounded-full px-2 py-1">
                {{ member.user.firstName + ' ' + member.user.lastName }}
              </div>
              <div *ngIf="project.projectMembers && project.projectMembers.length > 3"
                   class="text-xs text-gray-500">
                +{{project.projectMembers.length - 3}} autres
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectListComponent {
  projects = signal<ProjectWithMembers[]>([]);
  showOnlyMyProjects = signal<boolean>(true);
  currentUser: User | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeProjects();
  }

  private initializeProjects() {
    combineLatest([
      this.authService.currentUser$,
      this.projectService.getAll()
    ]).pipe(
      tap(([user]) => this.currentUser = user),
      switchMap(([user, response]) => {
        if (response.success) {
          // Pour chaque projet, récupérer ses membres
          const projectsWithMembers = response.data.map(project =>
            this.projectService.getProjectMembers(project.id!).pipe(
              map(membersResponse => ({
                ...project,
                projectMembers: membersResponse.success ? membersResponse.data : [],
                memberCount: membersResponse.success ? membersResponse.data.length : 0
              }))
            )
          );
          return forkJoin(projectsWithMembers);
        }
        return [];
      }),
      map(projects => {
        if (this.showOnlyMyProjects()) {
          return projects.filter(project =>
            this.isUserProjectMember(project)
          );
        }
        return projects;
      })
    ).subscribe(projects => {
      this.projects.set(projects);
    });
  }

  loadProjects() {
    this.initializeProjects(); // Réutiliser la même logique
  }

  isUserProjectMember(project: ProjectWithMembers): boolean {
    return project.projectMembers?.some(member =>
      member.user.id === this.currentUser?.id
    ) ?? false;
  }

  isUserProjectAdmin(project: ProjectWithMembers): boolean {
    return project.projectMembers?.some(member =>
      member.user.id === this.currentUser?.id &&
      member.role === 'ADMIN'
    ) ?? false;
  }

  toggleProjectView(showOnlyMine: boolean) {
    this.showOnlyMyProjects.set(showOnlyMine);
    this.loadProjects();
  }

  selectProject(project: Project) {
    this.router.navigate(['/dashboard', project.id]);
  }

  createNewProject() {
    this.router.navigate(['/projects/new']);
  }

  openManageMembers(project: Project) {
    this.router.navigate(['/projects', project.id, 'members']);
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
