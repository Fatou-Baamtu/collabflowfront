import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../interfaces/project.interface';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api.response.interface';
import {map, tap} from 'rxjs/operators';
import {ProjectMember} from '../interfaces/ProjectMemberInterface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private api = inject(ApiService);
  private endpoint = '/projects';
  private memberEndpoint = '/project-members';


  getAll(page = 0, size = 10): Observable<ApiResponse<Project[]>> {
    return this.api.get<Project[]>(`${this.endpoint}?page=${page}&size=${size}`).pipe(
      tap(response => {
        console.log('ProjectService - Raw response:', response);
        console.log('ProjectService - Projects count:', response.data?.length);
      })
    );
  }

  getById(id: number): Observable<ApiResponse<Project>> {
    return this.api.get<Project>(`${this.endpoint}/${id}`);
  }

  create(project: Project): Observable<ApiResponse<Project>> {
    return this.api.post<Project>(this.endpoint, project);
  }

  update(project: Project): Observable<ApiResponse<Project>> {
    return this.api.put<Project>(`${this.endpoint}/${project.id}`, project);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // Nouvelles méthodes pour la gestion des membres
  getProjectMembers(projectId: number): Observable<ApiResponse<ProjectMember[]>> {
    return this.api.get(`${this.memberEndpoint}/${projectId}/members`);
  }

  addProjectMember(projectId: number, userId: number, role: string): Observable<ApiResponse<ProjectMember>> {
    const memberData = {
      projectId,
      userId,
      role
    };
    return this.api.post(`${this.memberEndpoint}`, memberData);
  }

  updateProjectMember(memberId: number, role: string): Observable<ApiResponse<ProjectMember>> {
    const memberData = {
      id: memberId,
      role
    };
    return this.api.put(`${this.memberEndpoint}/${memberId}`, memberData);
  }

  removeProjectMember(memberId: number): Observable<ApiResponse<void>> {
    return this.api.delete(`${this.memberEndpoint}/${memberId}`);
  }

  // Méthode utilitaire pour vérifier si un utilisateur est membre d'un projet
  isUserMember(projectId: number, userId: number): Observable<boolean> {
    return this.getProjectMembers(projectId).pipe(
      map(response => response.success && response.data.some(member => member.user.id === userId))
    );
  }
}
