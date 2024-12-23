import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickableTask]',
  standalone: true
})
export class ClickableTaskDirective {
  @Input('appClickableTask') enabled: boolean = true;
  @Output() taskClick = new EventEmitter<void>();

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('click')
  onClick() {
    if (this.enabled) {
      this.taskClick.emit();
    }
  }
}

