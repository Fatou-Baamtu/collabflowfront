import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { TaskDetailComponent } from './task-detail.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, TaskDetailComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="mb-4">
          <h2 class="text-lg font-semibold">
            {{ taskId !== null ? 'Modifier la tâche' : 'Nouvelle tâche' }}
          </h2>
        </div>

        <app-task-detail
          [taskId]="taskId!"
          (saved)="handleSaved()"
          (cancelled)="handleCancelled()">
        </app-task-detail>
      </div>
    </div>
  `
})
export class TaskDetailDialogComponent {
  isOpen = false;
  taskId: number | null = null;
  private _afterClosed = new Subject<boolean>();
  afterClosed = this._afterClosed.asObservable();

  open(taskId?: number) {
    this.taskId = taskId ?? null;
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
