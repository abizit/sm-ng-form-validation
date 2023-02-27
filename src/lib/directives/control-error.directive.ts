import {
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

  // componentReference with  control-error-component type to inject the error message div to control error container
  ref!: ComponentRef<ControlErrorComponent>;
  container: ViewContainerRef;
  submit$: Observable<Event>;
  private subscriptionState = true;


  constructor(private controlDir: NgControl,
              @Optional() @Host() private form: FormSubmitDirective, // to catch the form events[submit event]
              // @ts-ignore
              @Inject(FORM_ERRORS) private errors, // to get the form errors (which is either default or provided by user)
              private vcr: ViewContainerRef,
              @Optional() controlErrorContainer: ControlErrorContainerDirective // gives reference of the div inside which the error message needs to be displayed
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.container = controlErrorContainer? controlErrorContainer.vcr: vcr;
  }


  ngOnInit(): void {
    // conditional check is true when the validation depends on other  controls in the  parent (eg: sale price should be less than normal price)
    const conditionalCheck = this.checkParent ? this.parentControl?.valueChanges: [];
    // @ts-ignore
    merge(this.submit$, this.control?.valueChanges, conditionalCheck).pipe(  // it listens to form submit event, control changes  and conditionally the changes in parent controls
      takeWhile(() => this.subscriptionState)
    ).subscribe(() => {
      const controlErrors = this.control?.errors || (this.checkParent ? this.parentControl?.errors : null);
      if (controlErrors) {
        let errorText;
        const keys = this.customErrors ? Object.keys(this.customErrors) : [];
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
          text = this.customErrors ? this.customErrors[firstKey] : (getError && getError(controlErrors[firstKey]));  // if custom error  is provided it shows that error or else looks into the default errors
        }
        this.setError(text);
      } else if (this.ref) {
        // if ref is  set and there is no error, we remove the error
        // the ref is set once when registering the error for the  first time.
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

  // we need parent control when we have to check the validation in the parent group
  get parentControl() {
    return this.controlDir?.control?.parent;
  }


  private setError(text: string): void {
    const showError = this.form.host.nativeElement.classList.contains('sm-ng-submitted') || this.partialCheck;
    this.setErrorBorder(text, showError);
    if(!this.ref) { // if ref is not defined, we create the ref to the control error component
      this.ref = this.vcr.createComponent(ControlErrorComponent);
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
