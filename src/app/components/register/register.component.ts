import { Component, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { passwordComplexityValidator } from 'src/util/pwdReq';

@Component({
  selector: 'app-register',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">
              <i class="fas fa-user-plus me-2"></i>Register
            </h2>
            
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control"
                  formControlName="email"
                  [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  Please enter a valid email address
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control"
                  formControlName="password"
                  [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  <div *ngIf="registerForm.get('password')?.errors?.['required']">
                    Password is required
                  </div>
                  <div *ngIf="registerForm.get('password')?.errors?.['minlength']">
                    Password must be at least 6 characters
                  </div>
                  <div *ngIf="registerForm.get('password')?.errors?.['noNumber']">
                    Password must contain at least one number
                  </div>
                  <div *ngIf="registerForm.get('password')?.errors?.['noUppercase']">
                    Password must contain at least one uppercase letter
                  </div>
                  <div *ngIf="registerForm.get('password')?.errors?.['noLowercase']">
                    Password must contain at least one lowercase letter
                  </div>
                </div>
              </div>
              
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100"
                [disabled]="registerForm.invalid || loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>
            
            <div class="text-center mt-3">
              <p>Already have an account? 
                <a href="/login" (click)="router.navigate(['/login'])">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        passwordComplexityValidator
      ]]
    });

    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/']);
      }
    })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
    }
  }
}
