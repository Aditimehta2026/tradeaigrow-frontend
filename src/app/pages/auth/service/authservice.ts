import { Apiservice } from '@/service/apiservice';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface RegisterPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: any;
    token?: string;
  };
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})

export class Authservice {
  constructor(private apiService: Apiservice) { }

  register(payload: any): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', payload);
  }

  verifyActivationCode(payload: VerifyOtpPayload): Observable<any> {
    return this.apiService.post<any>('auth/verify-activation-code', payload);
  }
  createPassword(payload: any): Observable<any> {
    return this.apiService.post<any>('auth/create-password', payload);
  }
    forgotPassword(payload: any) {
    return this.apiService.post<any>('auth/forgot-password', payload);
  }
    resetPassword(payload: any) {
    return this.apiService.post<any>('auth/reset-password', payload);
  }

}



