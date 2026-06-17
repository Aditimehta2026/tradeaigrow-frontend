import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DashboardCoin,DashboardData as DashboardService } from '../../service/dashboard-data';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule,ChartModule],
    templateUrl: './recentsaleswidget.html'
})
export class RecentSalesWidget implements OnInit {
    coins: DashboardCoin[] = [];
    private subscription?: Subscription;

    sparklineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      };

      constructor(private dashboardData: DashboardService) {}


    ngOnInit(): void {
      this.coins = this.dashboardData.getCurrentCoins();
      this.subscription = this.dashboardData.coins$.subscribe((data) => {
        if (data && data.length > 0) {
            this.coins = data;
        }
    });
    }
    
    ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
          localStorage.removeItem('tableData');
      }
  }

  getSparklineData(prices: number[] | undefined) {
    if (!prices || prices.length === 0) {
        return {
            labels: [],
            datasets: [{
                data: [],
                fill: false,
                tension: 0.3,
                borderWidth: 1,
                pointRadius: 0
            }]
        };
    }
    return {
        labels: prices.map((_, i) => i),
        datasets: [
            {
                data: prices,
                fill: false,
                tension: 0.3,
                borderWidth: 1,
                pointRadius: 0
            }
        ]
    };
}
      
}
