import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Apiservice {
  private baseUrl = '';

  constructor(private http: HttpClient) {
    const origin = window.location.origin;

if (origin.includes('localhost')) {
  this.baseUrl = 'http://localhost:3000/api';
} else {
  this.baseUrl = 'https://prodtradexcoin2026.onrender.com/api';
}
}

  // GET request
  get<T>(endpoint: string, params?: any): Observable<T> {
      const httpParams = new HttpParams({ fromObject: params });
      return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  // POST request with FormData (for file uploads)
  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
      return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData);
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
      return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  // PATCH request
  patch<T>(endpoint: string, data: any): Observable<T> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  }
}
