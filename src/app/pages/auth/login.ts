import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Authservice } from './service/authservice';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FloatLabelModule,
    FluidModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',

})
export class Login {
  email = '';
  password = '';
  checked = false;
  isLoading = false;
  errorDialog = false;
  errorMessage = '';
  errorSuggestion: any;

  constructor(
    private authService: Authservice,
    private router: Router
  ) {}

  onLogin(): void {
    const email = this.email.trim();
    const password = this.password.trim();
    if (!email || !password) {
      this.errorMessage = 'Please provide email and password';
      this.errorDialog = true;
      return;
    }

    this.isLoading = true;
    this.authService
      .login({ email, password })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response) {
            localStorage.setItem('user', JSON.stringify(response));
            const token = response.data?.token;
            if (token) localStorage.setItem('token', token);
          }
          this.router.navigate(['/app/dashboard']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Login failed. Please check your credentials.';
            this.errorSuggestion =
            error.error?.suggestion || 'Please check your credentials or verify your email address and try again.';
          this.errorDialog = true;

        },
      });
  }

  closeErrorDialog(): void {
    this.errorDialog = false;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
    this.checked = false;
  }
}