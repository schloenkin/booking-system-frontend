import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMessage = '';

  registerForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const request = this.registerForm.getRawValue();

    if (request.password !== request.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const registerRequest = {
      email: request.email,
      password: request.password,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        sessionStorage.setItem('accessToken', response.accessToken);

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'Email already exists';
          this.cd.detectChanges();
          return;
        }

        if (error.status === 400) {
          this.errorMessage = 'Invalid registration data';
          this.cd.detectChanges();
          return;
        }

        this.errorMessage = 'Registration failed. Please try again.';
        this.cd.detectChanges();
      },
    });
  }
}
