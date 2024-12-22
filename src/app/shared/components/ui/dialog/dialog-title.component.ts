import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold">
      <ng-content></ng-content>
    </h2>
  `
})
export class DialogTitleComponent {}
