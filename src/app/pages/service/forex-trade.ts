import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Apiservice } from '@/service/apiservice';
import { DashboardData } from './dashboard-data';

@Injectable({
  providedIn: 'root'
})
export class ForexTrade {
  constructor(
    private apiService: Apiservice,
    private dashboardData: DashboardData
  ) {}

  createTrade(payload: any): Observable<any> {
    return this.apiService.post<any>('forex-trade/create', payload).pipe(
      tap(() => {
        if (payload?.email) {
          this.dashboardData.getUserData(payload.email).subscribe();
        }
      })
    );
  }

  getHistory(email: string): Observable<any> {
    return this.apiService.post<any>('forex-trade/list', { email });
  }
}