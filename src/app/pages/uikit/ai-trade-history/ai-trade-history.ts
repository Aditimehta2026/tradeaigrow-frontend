import { AItrading } from '@/pages/service/aitrading';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-ai-trade-history',
  templateUrl: './ai-trade-history.html',
  styleUrl: './ai-trade-history.scss',
  imports: [CommonModule, TableModule, DialogModule,TagModule,ProgressSpinnerModule]
})
export class AiTradeHistory {
  AItradeHistory: any[] = [];
  email: string = '';
  // detailed card
  displayTradeDialog = false;
  selectedTrade: any = null;

  isLoading = false;


  constructor(private aitrading: AItrading) { }
  ngOnInit() {
    this.getAItradeHistory();
  }
  openTradeDialog(trade: any) {
    this.selectedTrade = trade;
    this.displayTradeDialog = true;
  }
  closeTradeDialog() {
    this.displayTradeDialog = false;
    this.selectedTrade = null;
  }

  fetchUserUserData() {
    const localData = localStorage.getItem('user');
    const userData = JSON.parse(localData || '{}');
    const user = userData?.data?.user || null;
    const userBalance = user?.balance || 0;
    this.email = user?.email || '';
    return userBalance;
  }

  getAItradeHistory() {
    this.isLoading=true;
    this.fetchUserUserData();
    this.aitrading.getHistory(this.email).subscribe((res) => {
      this.AItradeHistory = res.data;
      this.isLoading=false;
    });
  }
  ngOnDestroy() {

  }
}
