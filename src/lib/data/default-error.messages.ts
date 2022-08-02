import {InjectionToken} from '@angular/core';

export const defaultErrors = {
  required: () => 'This field is required',
  min: (requiredLength: number) => `The input should not be less than ${requiredLength}`,
  minlength: ({requiredLength, actualLength}:any) => `Expected ${requiredLength} but got ${actualLength}`,
  maxlength: ({requiredLength, actualLength}:any) => `Expected ${requiredLength} but got ${actualLength}`,
  email: () => 'Please enter a valid email',
  pattern: () => 'Invalid input'
};
export const FORM_ERRORS = new InjectionToken('FORM_ERRORS');
