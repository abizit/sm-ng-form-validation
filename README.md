# Introduction

This is an angular library to show error messages for  reactive forms in a cleaner way using the power of directives.

--- ---



## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Customisation](#customisation)
- [Contribution](#contribution)


## Installation

`npm install sm-ng-form-validation`

## Features

- Easily show the basic error messages for reactive forms
- Set default error messages across the app
- Manages error message state in the template
- Reduce form validation code


## Usage

We need to import the module  in our app.module.ts first.

#### Typescript

```ts
import {SmFormValidationModule} from 'sm-ng-form-validation'

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        SmFormValidationModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Then, we need to make the use of `formControlName`  and  `controlErrorContainer`  directives
to show the errors. <br/>
1. `controlErrorContainer`  - It should be given to the wrapper where the error is to be displayed.
2. `formControlName` - The input with formControlName should be wrapped with `controlErrorContainer` directive to show the error.

#### HTML

```html
<form [formGroup]="validationForm">
    <div class="form-group"  controlErrorContainer>
        <input type="text" formControlName="testField">
    </div>
    <button type="submit">Save</button>
</form>
```

## Customisation

There are easy customisation options readily available. If you want to change the color of 
the error message, you can simply pass the color code/name while importing the module.

####  Example

```ts
import {SmFormValidationModule} from 'sm-ng-form-validation'

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        SmFormValidationModule.forRoot({
            errorColor: 'red' // or any hex value
        })
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

However, to change other styles, the  `error` and `error-message` classes need to be overwritten.
1. `error`  -   This class is the styling for the container 
2. `error-message` - This class is the styling for the error message.

For the error messages, the  default messages are: 

```ts
export const defaultErrors = {
    required: () => 'This field is required',
    min: (requiredLength: number) => `The input should not be less than ${requiredLength}`,
    minlength: ({requiredLength, actualLength}:any) => `Expected ${requiredLength} but got ${actualLength}`,
    maxlength: ({requiredLength, actualLength}:any) => `Expected ${requiredLength} but got ${actualLength}`,
    email: () => 'Please enter a valid email',
    pattern: () => 'Invalid input'
};
```

The error messages can be overwritten while importing the module as :

```ts
import {SmFormValidationModule} from 'sm-ng-form-validation'

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        SmFormValidationModule.forRoot({
            defaultErrors: {
                required:() => 'This is a custom required message',
            }
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

The error messages can also be overwritten from the  template section as well.

#### HTML

```html
<form [formGroup]="validationForm">
    <div class="form-group"  controlErrorContainer>
        <input type="text" formControlName="testField" [customErrors]="{required:  'This is a custom message'}">
    </div>
    <button type="submit">Save</button>
</form>
```

## Contribution

If you  would like to contribute, you are welcome. Fork the repository  and open pull request.



