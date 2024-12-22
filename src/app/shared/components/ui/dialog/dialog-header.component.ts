import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {}
