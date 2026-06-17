import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { FluidModule } from 'primeng/fluid';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Authservice } from '../service/authservice';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        FormsModule,
        RouterModule,
        RippleModule,
        FluidModule,
        FloatLabelModule,
        DialogModule,
        CommonModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
    email: string = '';
    isLoading: boolean = false;
    successDialog: boolean = false;
    errorDialog: boolean = false;
    errorMessage: string = '';

    // Touched states for validation
    emailTouched: boolean = false;

    // Error messages
    emailError: string = '';

    private emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?){1,2}$/;

    constructor(
        private authService: Authservice,
        private router: Router
    ) { }

    validateEmail(): void {
        if (!this.email || this.email.trim().length === 0) {
            this.emailError = 'Please enter your email address';
        } else if (!this.emailRegex.test(this.email)) {
            this.emailError = 'Please enter a valid email address';
        } else {
            this.emailError = '';
        }
    }



    onEmailBlur(): void {
        this.emailTouched = true;
        this.validateEmail();
    }

    onSendResetLink() {
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
            email: this.email.trim(),
        };
        localStorage.setItem('email-forgot-password', this.email.trim());
        // Call auth service reset password method
        this.authService.forgotPassword(payload).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successDialog = true;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
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
        this.errorMessage = '';
    }
}