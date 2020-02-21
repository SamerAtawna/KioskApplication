import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBorder]'
})
export class BorderDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.border = "2px solid red";
  }


}
