import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DashboardData as DashboardService } from '../../service/dashboard-data';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';

@Component({
  standalone: true,
  selector: 'app-recent-sales-widget',
  imports: [CommonModule, TableModule, ChartModule, ProgressSpinnerModule, TranslatePipe, TabsModule],
  templateUrl: './recentsaleswidget.html',
  styleUrls: ['./recentsaleswidget.scss']
})
export class RecentSalesWidget implements OnInit {
  marketData: Record<'crypto' | 'forex' | 'commodities', any[]> = {
    crypto: [],
    forex: [],
    commodities: [],
  };

  isLoading = false;
  private pendingLoads = 0;

  commodityBadge: Record<string, { text: string; class: string }> = {
    'GC=F': { text: 'GC', class: 'gold' },
    'SI=F': { text: 'SI', class: 'silver' },
    'CL=F': { text: 'CL', class: 'oil' },
    'BZ=F': { text: 'BZ', class: 'brent' },
    'NG=F': { text: 'NG', class: 'gas' },
    'HG=F': { text: 'HG', class: 'copper' },
    'PL=F': { text: 'PL', class: 'platinum' },
    'PA=F': { text: 'PA', class: 'palladium' },
  };

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
    (['crypto', 'forex', 'commodities'] as const).forEach((type) => this.loadMarket(type));
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

  loadMarket(type: 'crypto' | 'forex' | 'commodities') {
    const cached = localStorage.getItem(`tableData_${type}`);
    if (cached) {
      try {
        this.marketData[type] = JSON.parse(cached);
      } catch {
        this.marketData[type] = [];
      }
    }

    this.pendingLoads++;
    this.isLoading = true;

    this.dashboardData.getMarketData(type).subscribe({
      next: (res) => {
        this.marketData[type] = res;
        this.finishLoad();
      },
      error: () => {
        this.finishLoad();
      },
    });
  }

  private finishLoad() {
    this.pendingLoads = Math.max(0, this.pendingLoads - 1);
    this.isLoading = this.pendingLoads > 0;
  }
}