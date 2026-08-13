import { Apiservice } from '@/service/apiservice';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notification {
  constructor(private apiService: Apiservice) {}

  getNotifications(payload: any): Observable<any> {
    return this.apiService.post<any>('notifications/list', payload);
  }

  markAsRead(payload: any): Observable<any> {
    return this.apiService.post<any>('notifications/read', payload);
  }

  markAllAsRead(payload: any = {}): Observable<any> {
    return this.apiService.post<any>('notifications/read-all', payload);
  }
}
