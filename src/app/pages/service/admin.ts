import { Injectable } from '@angular/core';
import { Apiservice } from '@/service/apiservice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Admin {
  constructor(private apiService: Apiservice) {}

  getAllUsers(): Observable<any> {
    return this.apiService.post<any>('admin/users', {});
  }
  createDeposit(payload: any): Observable<any> {
    return this.apiService.post<any>('deposit/create', payload);
  }
}
