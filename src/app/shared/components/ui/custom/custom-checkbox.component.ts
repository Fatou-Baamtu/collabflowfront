import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center">
      <input
        type="checkbox"
        [id]="id"
        [checked]="value"
        (change)="onChange($event)"
        (blur)="onTouched()"
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
      />
      <label [for]="id" class="ml-2 block text-sm text-gray-700 cursor-pointer">
        {{ label }}
      </label>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true
    }
  ]
})
export class CustomCheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() id: string = '';

  value: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = (event: any) => {
      fn(event.target.checked);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
