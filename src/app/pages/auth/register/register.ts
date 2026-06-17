import { Component } from '@angular/core';
import { Authservice } from '../service/authservice';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-register',
  imports: [ ButtonModule, InputTextModule, FormsModule, RouterModule, RippleModule, DialogModule, FloatLabelModule , FluidModule ,CommonModule,ProgressSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
    email: string = '';
    isLoading: boolean = false;
    successDialog: boolean = false;
    errorDialog: boolean = false;
    errorMessage: string = '';
    errorSuggestion: string = '';

    // Touched states
    emailTouched: boolean = false;
    // Error messages
    emailError: string = '';

    private emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?){1,2}$/;

    constructor(
        private authService: Authservice,
        private router: Router
    ) { }

    // Validation methods
    validateEmail(): void {
        if (!this.email || this.email.trim().length === 0) {
            this.emailError = 'Please enter your email';
        } else if (!this.emailRegex.test(this.email.trim())) {
            this.emailError = 'Please enter a valid email address';
        } else {
            this.emailError = '';
        }
    }

    // Blur handlers
    onEmailBlur(): void {
        this.emailTouched = true;
        this.validateEmail();
    }

    onRegister() {
        // Mark all fields as touched
        this.emailTouched = true;
        // Validate all fields
        this.validateEmail();

        // Check if there are any errors
        if (this.emailError) {
            return;
        }
        this.isLoading = true;
        const payload = {
            email: this.email.trim()
        };
        localStorage.setItem('email-register', this.email.trim());
        this.authService.register(payload).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/auth/verification-new-register']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
                this.errorSuggestion = error.error?.suggestion || 'Please try a different email address.';
                this.errorDialog = true;
            }
        });
    }

    goToLogin() {
        this.successDialog = false;
        this.router.navigate(['/auth/login']);
    }

    closeErrorDialog() {
        this.errorDialog = false;
        this.email = '';
        this.emailTouched = false;
        this.emailError = '';
    }
}
