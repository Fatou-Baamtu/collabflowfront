// subtask-list.component.ts
import {AfterViewInit, Component, ElementRef, Input, OnInit, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Status} from '../../core/interfaces/enums';
import {SubTask} from '../../core/interfaces/subtask.interface';
import {SubTaskService} from '../../core/services/subtask.service';
import {CustomCheckboxComponent} from '../../shared/components/ui/custom/custom-checkbox.component';
import {CustomInputComponent} from '../../shared/components/ui/custom/custom-input.component';
import {CustomButtonComponent} from '../../shared/components/ui/custom/custom-button.component';


@Component({
  selector: 'app-subtask-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCheckboxComponent, CustomInputComponent, CustomButtonComponent],
  template: `
    <div class="subtasks-section mt-4">
      <h3 class="text-lg font-medium text-gray-900">Sous-tâches</h3>
      <div class="mt-2 space-y-2">
        @for (subtask of subtasks(); track subtask.id) {
          <div class="flex items-center gap-2">
            <!-- Correction des bindings du CustomCheckboxComponent -->
            <app-custom-checkbox
              [id]="'subtask-' + subtask.id"
              [label]="''"
              [(ngModel)]="subtask.checked"
              (ngModelChange)="toggleSubtask(subtask)"
            ></app-custom-checkbox>

            @if (editingId === subtask.id) {
              <app-custom-input
                [id]="'edit-subtask-' + subtask.id"
                [(ngModel)]="editingTitle"
                (blur)="updateSubtask(subtask)"
                (keyup.enter)="updateSubtask(subtask)"
                (keyup.escape)="cancelEdit()"
                #editInput
              ></app-custom-input>
            } @else {
              <span
                [class.line-through]="subtask.status === Status.DONE"
                (dblclick)="startEdit(subtask)"
                class="flex-1 cursor-pointer hover:text-gray-600"
              >
                {{subtask.title}}
              </span>
              <button
                (click)="startEdit(subtask)"
                class="px-2 py-1 text-gray-500 hover:text-blue-600"
              >
                ✏️
              </button>
              <button
                (click)="deleteSubtask(subtask)"
                class="px-2 py-1 text-gray-500 hover:text-red-600"
              >
                🗑️
              </button>
            }
          </div>
        }

        <div class="flex items-center gap-2 mt-2">
          <app-custom-input
            id="new-subtask"
            [(ngModel)]="newSubtaskTitle"
            (keyup.enter)="addSubtask()"
            placeholder="Ajouter une sous-tâche"
          ></app-custom-input>
          <app-custom-button
            (onClick)="addSubtask()"
          >
            Ajouter
          </app-custom-button>
        </div>
      </div>
    </div> `
})
export class SubtaskListComponent implements OnInit, AfterViewInit {
  @Input() taskId!: number;
  @ViewChild('editInput') editInput!: ElementRef;

  Status = Status;
  subtasks = signal<(SubTask & { checked?: boolean })[]>([]);
  newSubtaskTitle = '';
  editingId: number | null = null;
  editingTitle = '';

  constructor(private subtaskService: SubTaskService) {}

  ngOnInit() {
    this.loadSubtasks();
  }

  loadSubtasks() {
    this.subtaskService.getAll(this.taskId).subscribe(response => {
      if (response.success) {
        // Ajouter la propriété checked basée sur le status
        const tasksWithChecked = response.data.map(task => ({
          ...task,
          checked: task.status === Status.DONE
        }));
        this.subtasks.set(tasksWithChecked);
      }
    });
  }



  startEdit(subtask: SubTask) {
    this.editingId = subtask.id!;
    this.editingTitle = subtask.title;
    setTimeout(() => {
      this.editInput?.nativeElement?.focus();
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.editingTitle = '';
  }

  updateSubtask(subtask: SubTask) {
    if (this.editingTitle.trim() && this.editingTitle !== subtask.title) {
      const updatedSubtask: SubTask = {
        ...subtask,
        title: this.editingTitle.trim()
      };

      this.subtaskService.update(updatedSubtask).subscribe(response => {
        if (response.success) {
          this.loadSubtasks();
        }
      });
    }
    this.cancelEdit();
  }

  deleteSubtask(subtask: SubTask) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-tâche ?')) {
      this.subtaskService.delete(subtask.id!).subscribe(response => {
        if (response.success) {
          this.loadSubtasks();
        }
      });
    }
  }

  toggleSubtask(subtask: SubTask & { checked?: boolean }) {
    const newStatus = subtask.checked ? Status.DONE : Status.TODO;
    const updatedSubtask: SubTask = {
      ...subtask,
      status: newStatus
    };

    this.subtaskService.update(updatedSubtask).subscribe(response => {
      if (response.success) {
        this.loadSubtasks();
      }
    });
  }
  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const newSubtask: SubTask = {
        title: this.newSubtaskTitle,
        status: Status.TODO,
        taskId: this.taskId
      };

      this.subtaskService.create(newSubtask).subscribe(response => {
        if (response.success) {
          this.newSubtaskTitle = '';
          this.loadSubtasks();
        }
      });
    }
  }

  ngAfterViewInit(): void {
  }
}
