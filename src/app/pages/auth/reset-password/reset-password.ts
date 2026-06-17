import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { Authservice } from '../service/authservice';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    DialogModule,
    FluidModule,
    PasswordModule,
    ProgressSpinnerModule,
    RippleModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  password: string = '';
  confirmPassword: string = '';

  passwordTouched: boolean = false;
  confirmPasswordTouched: boolean = false;

  passwordError: string = '';
  confirmPasswordError: string = '';

  isLoading: boolean = false;
  successDialog: boolean = false;
  errorDialog: boolean = false;
  errorMessage: string = '';

  token: string = '';
  email: string = '';

  constructor(
    private authService: Authservice,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Supports reset links like /auth/reset-password?token=...&email=...
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.getEmailForgotPassword();
  }

  getEmailForgotPassword(): void {
    const qp = this.route.snapshot.queryParamMap;
    // Only email from query param
    this.email = (qp.get('email') ?? '').trim();
  }

  validatePassword(): void {
    if (!this.password || this.password.length === 0) {
      this.passwordError = 'Please enter your password';
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
    } else {
      this.passwordError = '';
    }

    // Re-validate confirm password if user has already interacted with it
    if (this.confirmPasswordTouched) {
      this.validateConfirmPassword();
    }
  }

  validateConfirmPassword(): void {
    if (!this.confirmPassword || this.confirmPassword.length === 0) {
      this.confirmPasswordError = 'Please confirm your password';
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
    } else {
      this.confirmPasswordError = '';
    }
  }

  onPasswordChange(): void {
    if (!this.passwordTouched) {
      this.passwordTouched = true;
    }
    this.validatePassword();
  }

  onConfirmPasswordChange(): void {
    if (!this.confirmPasswordTouched) {
      this.confirmPasswordTouched = true;
    }
    this.validateConfirmPassword();
  }

  onPasswordBlur(): void {
    this.passwordTouched = true;
    this.validatePassword();
  }

  onConfirmPasswordBlur(): void {
    this.confirmPasswordTouched = true;
    this.validateConfirmPassword();
  }

  onResetPassword(): void {
    this.passwordTouched = true;
    this.confirmPasswordTouched = true;

    this.validatePassword();
    this.validateConfirmPassword();

    // Check if there are any errors
    if (this.passwordError || this.confirmPasswordError) {
      return;
    }

    this.isLoading = true;

    const payload = {
      token: this.token,
      email: this.email,
      password: this.password.trim(),
      confirmPassword: this.confirmPassword.trim()
    };

    // NOTE:
    // Your current Authservice does not yet have a "confirm reset password" API method.
    // Add one like: this.apiService.post('auth/reset-password/confirm', payload)
    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successDialog = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Failed to reset password. Please try again.';
        this.errorDialog = true;
      }
    });
  }

  goToLogin(): void {
    this.successDialog = false;
    this.router.navigate(['/auth/login']);
  }

  closeErrorDialog(): void {
    this.errorDialog = false;
    this.errorMessage = '';
  }
}