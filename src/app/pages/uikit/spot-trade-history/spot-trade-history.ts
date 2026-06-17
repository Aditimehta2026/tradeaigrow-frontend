import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DashboardData } from '../../service/dashboard-data';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spot-trade-history',
  imports: [CommonModule, TableModule, DialogModule, ProgressSpinnerModule],
  templateUrl: './spot-trade-history.html',
  styleUrl: './spot-trade-history.scss'
})
export class SpotTradeHistory {
  tradeHistory: any[] = [];

  // dialog for trade
  displayTradeDialog = false;
  selectedTrade: any | null = null;
  isLoading:boolean=false;

  constructor(
      private dashboardData: DashboardData
  ) {}

  ngOnInit() {
      // Fetch trade history from API
      this.getTradeHistory();
  }

    openTradeDialog(trade: any): void {
      this.selectedTrade = trade;
      this.displayTradeDialog = true;
  }
  closeTradeDialog(): void {
      this.displayTradeDialog = false;
      this.selectedTrade = null;
  }

  getTradeHistory() {
      this.isLoading=true;
      const user = localStorage.getItem('user');
      if (!user) return;
      try {
          const userData = JSON.parse(user);
          const userEmail = userData?.data?.user?.email || userData?.user?.email;
          if (userEmail) {
              this.dashboardData.getTradeHistory(userEmail).subscribe({
                  next: (res) => {
                      console.log("trade history", res);
                      this.tradeHistory = res.data;
                      this.isLoading=false;
                      // Data will be automatically updated via subscription
                  },
                  error: (err) => {
                      console.warn('Error fetching trade history:', err);
                  }
              });
          }
      } catch (error) {
          console.error('Error parsing user data:', error);
      }
  }
}
