import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const request = this.loginForm.getRawValue();

    this.authService.login(request).subscribe({
      next: (response) => {
        sessionStorage.setItem('accessToken', response.accessToken);

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('LOGIN ERROR:', error);
      },
    });
  }
}
