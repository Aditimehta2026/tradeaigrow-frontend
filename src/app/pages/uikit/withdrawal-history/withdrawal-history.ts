import { Component } from '@angular/core';
import { Withdraw } from '@/pages/service/withdraw';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

type WithdrawStatus = 'Completed' | 'Pending' | 'Failed';


@Component({
  selector: 'app-withdrawal-history',
  imports: [CommonModule, DialogModule,ProgressSpinnerModule],
  templateUrl: './withdrawal-history.html',
  styleUrl: './withdrawal-history.scss'
})
export class WithdrawalHistory {
  withdrawHistory: any[] = [];
  selectedWithdraw: any;
  showCurrentWithdraw = false;
  email: string = "";
  isLoading: boolean = false;

  constructor(private withdrawService: Withdraw) { }

  ngOnInit() {
    this.getUserWithdrawList();
  }

  fetchUserUserData() {
    const localData = localStorage.getItem('user');
    const userData = JSON.parse(localData || '{}');
    const user = userData?.data?.user || null;
    this.email = user?.email || '';
  }

  getUserWithdrawList() {
    this.isLoading=true;
    this.fetchUserUserData();
    this.withdrawService.getWithdrawHistory(this.email).subscribe((res) => {
      this.withdrawHistory = res.data;
      this.isLoading=false;
    });
  }

  openDialog(withdraw: any) {
    this.selectedWithdraw = withdraw;
    this.showCurrentWithdraw = true;
  }

  closeWithdrawDialog() {
    this.showCurrentWithdraw = false;
    this.selectedWithdraw = null;
  }
  getStatusClass(status: WithdrawStatus): string {
    if (status === 'Completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
    if (status === 'Pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
    return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
  }


}
