import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogTitleComponent
} from '../../shared/components/ui/dialog';
import {TaskDetailComponent} from './task-detail.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    TaskDetailComponent
  ],
  template: `
    <app-dialog [isOpen]="isOpen" (isOpenChange)="handleOpenChange($event)">
      <app-dialog-header>
        <app-dialog-title>
          {{ taskId ? 'la tâche' : 'Nouvelle tâche' }} (ID: {{taskId}})
        </app-dialog-title>
      </app-dialog-header>
      <app-dialog-content>
        <app-task-detail
          *ngIf="taskId"
          [taskId]="taskId"
          (saved)="handleSaved()"
          (cancelled)="handleCancelled()">
        </app-task-detail>
      </app-dialog-content>
    </app-dialog>
  `
})
export class TaskDetailDialogComponent {

  private _afterClosed = new Subject<boolean>();
  afterClosed = this._afterClosed.asObservable();

  isOpen = false;
  taskId: number | null = null;

  open(taskId?: number) {
    console.log('TaskDetailDialog - Opening with taskId:', taskId);
    // Assurez-vous que taskId est un nombre
    this.taskId = typeof taskId === 'number' ? taskId : null;
    this.isOpen = true;
  }

  handleOpenChange(open: boolean) {
    this.isOpen = open;
    if (!open) {
      this._afterClosed.next(false);
    }
  }

  handleSaved() {
    this.isOpen = false;
    this._afterClosed.next(true);
  }

  handleCancelled() {
    this.isOpen = false;
    this._afterClosed.next(false);
  }
}
