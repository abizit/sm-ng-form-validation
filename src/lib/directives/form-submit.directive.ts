import {Directive, ElementRef} from '@angular/core';
import {shareReplay, tap} from 'rxjs/operators';
import {fromEvent} from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form'
})

export class FormSubmitDirective {
  submit$ = fromEvent(this.element, 'submit').pipe(
    tap(_ => {
      if (this.element.classList.contains('submitted') === false) {
        this.element.classList.add('submitted');
      }
    }),
    shareReplay(1)
  );
  constructor(public host: ElementRef<HTMLFormElement>) {
  }
  get element() {
    return this.host.nativeElement;
  }
}
