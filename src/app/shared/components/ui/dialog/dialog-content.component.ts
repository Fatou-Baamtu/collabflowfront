import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-2">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogContentComponent {}
