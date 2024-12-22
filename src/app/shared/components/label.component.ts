import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  template: `
    <span [class]="getLabelClasses()">
      {{text}}
    </span>
  `
})
export class LabelComponent {
  @Input() text!: string;
  @Input() color: 'red' | 'blue' | 'green' | 'yellow' | 'gray' = 'gray';

  getLabelClasses(): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded';
    const colorClasses = {
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return `${baseClasses} ${colorClasses[this.color]}`;
  }
}
