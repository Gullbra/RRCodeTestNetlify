import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return null; // Letting required validator handle empty values
  }

  const errors: ValidationErrors = {};
  
  if (!/\d/.test(value))
    errors['noNumber'] = true;

  
  if (!/[A-Z]/.test(value))
    errors['noUppercase'] = true;

  
  if (!/[a-z]/.test(value))
    errors['noLowercase'] = true;

  
  return Object.keys(errors).length ? errors : null;
}
