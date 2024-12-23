import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import {Status} from '../../core/interfaces/enums';

@Directive({
  selector: '[appHighlightTask]',
  standalone: true
})
export class HighlightTaskDirective implements OnChanges {
  @Input('appHighlightTask') status: Status = Status.TODO;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const colors: { [key in Status]: string } = {
      [Status.TODO]: '#cfe2ff',
      [Status.IN_PROGRESS]: '#cfedf1',
      [Status.DONE]: '#d1e7dd'
    };
    this.el.nativeElement.style.backgroundColor = colors[this.status] || 'transparent';
  }
}
