import {ModuleWithProviders, NgModule} from '@angular/core';
import {ControlErrorComponent} from './components';
import {ControlErrorContainerDirective, ControlErrorDirective, FormSubmitDirective} from './directives';
import {SMFormValidationConfig} from './interface';
import {defaultErrors, FORM_ERRORS} from './data';

@NgModule({
  declarations: [
    ControlErrorComponent,
    ControlErrorDirective,
    ControlErrorContainerDirective,
    FormSubmitDirective

  ],
  imports: [
  ],
  exports: [
    ControlErrorComponent,
    ControlErrorDirective,
    ControlErrorContainerDirective,
    FormSubmitDirective
  ]
})
// @ts-ignore
export class SmFormValidationModule {
  static forRoot(config?: SMFormValidationConfig): ModuleWithProviders<SmFormValidationModule> {
    if (config && config.hasOwnProperty('errorColor'))  {
      const root = document.querySelector(':root');
      // @ts-ignore
      root.style.setProperty('--sm-validation-error-color', config.errorColor)
    }
    return {
      ngModule: SmFormValidationModule,
      // conditionally setting the error messages in runtime
      providers:[{
        provide: FORM_ERRORS,
        useFactory:() => ({...defaultErrors, ...(config && hasErrorMessages(config.defaultErrors) && config.defaultErrors)})
      }]
    }
  }
}

function hasErrorMessages(obj: object  | undefined): boolean  {
  if (!obj)  {
    return false;
  }
  if (isNotEmpty(obj)) {
    return true
  }
  return false;
}

function isNotEmpty(object: Object): boolean {
  // @ts-ignore
  return Object.values(object).some(x => (x !== undefined && x !== null && x !== ''));
}
