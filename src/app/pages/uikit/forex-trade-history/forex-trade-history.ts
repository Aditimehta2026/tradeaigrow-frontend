import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DashboardData } from '../../service/dashboard-data';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { ForexTrade } from '@/pages/service/forex-trade';

@Component({
  selector: 'app-forex-trade-history',
  imports: [CommonModule, TableModule, DialogModule, ProgressSpinnerModule, TranslatePipe],
  templateUrl: './forex-trade-history.html',
  styleUrl: './forex-trade-history.scss'
})
export class ForexTradeHistory {
  // ===== State =====
  tradeHistory: any[] = [];
  isLoading: boolean = false;

  // ===== Dialog =====
  displayTradeDialog = false;
  selectedTrade: any | null = null;

  constructor(private dashboardData: DashboardData,private forexTrade: ForexTrade) {}

  // ===== Lifecycle =====
  ngOnInit(): void {
    this.getTradeHistory();
  }

  // ===== Dialog =====
  openTradeDialog(trade: any): void {
    this.selectedTrade = trade;
    this.displayTradeDialog = true;
  }

  closeTradeDialog(): void {
    this.displayTradeDialog = false;
    this.selectedTrade = null;
  }

  // ===== API =====
  getTradeHistory(): void {
    this.isLoading = true;

    const user = localStorage.getItem('user');
    if (!user) {
      this.isLoading = false;
      return;
    }

    try {
      const userData = JSON.parse(user);
      const userEmail = userData?.data?.user?.email || userData?.user?.email;

      if (!userEmail) {
        this.isLoading = false;
        return;
      }

       // Note: currently uses spot-trade/list — same API forex-trade-form writes to
      this.forexTrade.getHistory(userEmail).subscribe({
        next: (res) => {
          this.tradeHistory = res?.data ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          console.warn('Error fetching forex trade history:', err);
          this.tradeHistory = [];
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.isLoading = false;
    }
  }

  // ===== Helpers =====
  formatPair(coinname: string | null | undefined): string {
    if (!coinname) return 'N/A';
    // EURUSD -> EUR/USD
    if (coinname.length === 6 && !coinname.includes('/')) {
      return `${coinname.slice(0, 3)}/${coinname.slice(3)}`;
    }
    return coinname;
  }
}
