import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Host,
  Inject,
  Input, OnDestroy, OnInit,
  Optional,
  ViewContainerRef
} from '@angular/core';
import {NgControl} from '@angular/forms';
import {takeWhile} from 'rxjs/operators';
import {EMPTY, Observable, merge} from 'rxjs';

import {ControlErrorComponent} from '../components';
import {FORM_ERRORS} from '../data';

import {ControlErrorContainerDirective} from './control-error-container.directive';
import {FormSubmitDirective} from './form-submit.directive';


@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[formControl], [formControlName]'
})

export class ControlErrorDirective implements OnInit, OnDestroy{
  @Input() customErrors: any = {};
  @Input() checkParent = false;
  @Input() partialCheck = false;

  ref!: ComponentRef<ControlErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<Event>;
  private subscriptionState = true;


  constructor(private controlDir: NgControl,
              @Optional() @Host() private form: FormSubmitDirective,
              // @ts-ignore
              @Inject(FORM_ERRORS) private errors,
              private resolver: ComponentFactoryResolver,
              private vcr: ViewContainerRef,
              @Optional() controlErrorContainer: ControlErrorContainerDirective) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = controlErrorContainer? controlErrorContainer.vcr: vcr;
  }


  ngOnInit(): void {
    const conditionalCheck = this.checkParent ? this.parentControl?.valueChanges: [];
    // @ts-ignore
    merge(this.submit$, this.control?.valueChanges, conditionalCheck).pipe(
      takeWhile(() => this.subscriptionState)
    ).subscribe(() => {
      const controlErrors = this.control?.errors || (this.checkParent ? this.parentControl?.errors : null);
      if (controlErrors) {
        let errorText;
        const keys = Object.keys(this.customErrors);
        if (keys.length > 0) {
          for (let i = 0; i <  keys.length; i++) {
            if (controlErrors.hasOwnProperty(keys[i])) {
              errorText = this.customErrors[keys[i]];
              break;
            }
          }
        }
        let text = errorText;
        if (!errorText) {
          const firstKey = Object.keys(controlErrors)[0];
          const getError = this.errors[firstKey];
          text = this.customErrors[firstKey] || (getError && getError(controlErrors[firstKey]) );
        }
        this.setError(text);
      } else if (this.ref) {
        this.setError('');
      }
    });
  }


  ngOnDestroy(): void {
    this.subscriptionState = false;
  }

  get control() {
    return this.controlDir.control;
  }

  get parentControl() {
    return this.controlDir?.control?.parent;
  }


  private setError(text: string): void {
    const showError = this.form.host.nativeElement.classList.contains('sm-ng-submitted') || this.partialCheck;
    this.setErrorBorder(text, showError);
    if(!this.ref) {
      const factory = this.resolver.resolveComponentFactory(ControlErrorComponent);
      this.ref = this.vcr.createComponent(factory);
      const element = this.ref.location.nativeElement as HTMLElement;
      element.style.width = '100%';
    }
    this.ref.instance['text'] = (text && showError) ? text : '';
  }


  private setErrorBorder(state: string | null, showError: boolean): void {
   if(state && showError) {
     this.container.element.nativeElement.classList.add('sm-ng-error');
   } else {
     this.container.element.nativeElement.classList.remove('sm-ng-error');
   }
  }

}
