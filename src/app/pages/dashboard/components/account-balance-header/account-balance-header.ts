import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardData } from '../../../service/dashboard-data';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-account-balance-header',
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './account-balance-header.html',
  styleUrl: './account-balance-header.scss'
})
export class AccountBalanceHeader {
  balance = 0;
  totalDeposit = 0;
  totalWithdrawal = 0;
  todayPnl = 0;
  todayGain = 0;
  private subscription?: Subscription;

  constructor(private dashboardData: DashboardData, private router: Router) { }

  ngOnInit(): void {
    // Subscribe to user data from API via BehaviorSubject
    this.subscription = this.dashboardData.userData$.subscribe((userData) => {
      if (userData) {
        // Extract dashboardData from the API response
        const dashboardData = userData?.dashboardData || userData;

        this.balance = Number(dashboardData?.balance ?? 0);
        this.totalDeposit = Number(dashboardData?.totalDeposit ?? 0);
        this.totalWithdrawal = Number(dashboardData?.totalWithdrawal ?? 0);
        this.todayPnl = Number(dashboardData?.todayPnl ?? 0);
        this.todayGain = Number(dashboardData?.todayGain ?? 0);
      }
    });
  }
  goTo(path: string): void {
    this.router.navigate([path]);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
