import {InjectionToken} from '@angular/core';

export const defaultErrors = {
  required: () => 'This field is required',
  minLength: ({requiredLength, actualLength}:any) => `Expect ${requiredLength} but got ${actualLength}`,
  emailPattern: () => 'Please enter a valid email',
  passwordStrength: () => 'Password strength should at least be Good',
  expiry: () => 'Expiry format is invalid',
  passwordMatch: () => 'Password should match!',
  customRequired: () => 'This field is required',
  email:() =>'Invalid email format'
};
export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});
