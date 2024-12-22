import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-due-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input
        type="date"
        [ngModel]="dueDate"
        (ngModelChange)="dateChanged($event)"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      @if (dueDate) {
        <button
          (click)="clearDate()"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      }
    </div>
  `
})
export class DueDatePickerComponent {
  @Input() dueDate: Date | null = null;
  @Output() dueDateChange = new EventEmitter<Date | null>();

  dateChanged(value: string) {
    this.dueDateChange.emit(value ? new Date(value) : null);
  }

  clearDate() {
    this.dueDateChange.emit(null);
  }
}
