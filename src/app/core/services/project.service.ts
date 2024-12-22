import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Project } from '../interfaces/project.interface';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api.response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private api = inject(ApiService);
  private endpoint = '/api/projects';

  getAll(page = 0, size = 10): Observable<ApiResponse<Project[]>> {
    return this.api.get<Project[]>(`${this.endpoint}?page=${page}&size=${size}`);
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
}
