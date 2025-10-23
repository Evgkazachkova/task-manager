import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthCustom(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString();
    if (value.length < minLength) {
      return {
        minLengthCustom: {
          requiredLength: minLength,
          actualLength: value.length,
        },
      };
    }

    return null;
  };
}
