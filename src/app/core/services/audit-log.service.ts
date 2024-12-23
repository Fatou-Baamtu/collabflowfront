import {inject, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api.response.interface';
import {AuditLog} from '../interfaces/audit-log.interface';
import {EntityEnum} from '../interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private api = inject(ApiService);
  private endpoint = '/audit-logs';

  getAll(page = 0, size = 10): Observable<ApiResponse<AuditLog[]>> {
    return this.api.get<AuditLog[]>(`${this.endpoint}?page=${page}&size=${size}`);
  }

  getByEntity(entityType: EntityEnum, entityId: number): Observable<ApiResponse<AuditLog[]>> {
    return this.api.get<AuditLog[]>(`${this.endpoint}?entityType=${entityType}&entityId=${entityId}`);
  }
}
