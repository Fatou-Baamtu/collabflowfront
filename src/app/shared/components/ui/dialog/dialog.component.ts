import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50" (click)="close()"></div>

        <!-- Dialog -->
        <div class="relative z-50 w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class DialogComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
