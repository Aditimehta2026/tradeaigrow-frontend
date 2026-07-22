import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardData } from '../../../service/dashboard-data';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-balance-header',
  imports: [CommonModule, RouterModule, ButtonModule,TranslatePipe],
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
  quickActions = [
    {
      label: 'Spot',
      subtitle: 'BTC · ETH',
      path: '/app/page/spot-trade',
      icon: 'pi-bitcoin',
      rippleClass: 'action-spot',
      iconBgClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
      glowClass: 'bg-gradient-to-br from-indigo-500/10 to-transparent',
      topBarClass: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
    },
    {
      label: 'AI',
      subtitle: 'Auto trade',
      badge: 'Hot',
      path: '/app/page/ai-trading',
      icon: 'pi-sparkles',
      rippleClass: 'action-ai',
      iconBgClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
      glowClass: 'bg-gradient-to-br from-violet-500/10 to-transparent',
      topBarClass: 'bg-gradient-to-r from-violet-400 to-violet-600',
    },
    {
      label: 'Commodity',
      subtitle: 'Gold · Oil',
      path: '/app/page/commodity-trading',
      icon: 'pi-chart-line',
      rippleClass: 'action-commodity',
      iconBgClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      glowClass: 'bg-gradient-to-br from-emerald-500/10 to-transparent',
      topBarClass: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    },
    {
      label: 'Forex',
      subtitle: 'EUR · USD',
      path: '/app/page/forex-trade',
      icon: 'pi-dollar',
      rippleClass: 'action-forex',
      iconBgClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
      glowClass: 'bg-gradient-to-br from-amber-500/10 to-transparent',
      topBarClass: 'bg-gradient-to-r from-amber-400 to-amber-600',
    },
  ];

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
