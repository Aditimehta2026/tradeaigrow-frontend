import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { DashboardData as DashboardService } from '../../service/dashboard-data';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule,ChartModule,ProgressSpinnerModule,TranslatePipe],
    templateUrl: './recentsaleswidget.html'
})
export class RecentSalesWidget implements OnInit {
    coins: any[] = [];
    isLoading = false;

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


    ngOnInit() {
      this.gettableData();
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
  gettableData() {
    const cached = localStorage.getItem('tableData');
    if (cached) {
      try {
        this.coins = JSON.parse(cached);
      } catch (e) {
        this.coins = [];
      }
    }

    this.isLoading = true;

    this.dashboardData.getData().subscribe({
      next: (res) => {
        this.coins = res;
        localStorage.setItem('tableData', JSON.stringify(res));
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('API error:', err);
        this.isLoading = false;
      }
    });
  }
      
}
