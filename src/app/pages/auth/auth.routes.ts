import { Routes } from '@angular/router';
import { Login } from './login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { VerificationNewRegister } from './verification-new-register/verification-new-register';
import { CreatePassword } from './create-password/create-password';
import { ResetPassword } from './reset-password/reset-password';

export default [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'verification-new-register', component: VerificationNewRegister },
    { path: 'create-password', component: CreatePassword },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword }
] as Routes;
