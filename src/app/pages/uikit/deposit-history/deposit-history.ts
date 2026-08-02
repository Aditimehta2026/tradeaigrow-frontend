import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Deposit } from '@/pages/service/deposit';

type DepositStatus = 'Completed' | 'Pending' | 'Failed';

@Component({
  selector: 'app-deposit-history',
  imports: [CommonModule, DialogModule, ButtonModule, ProgressSpinnerModule, RouterModule, TranslatePipe],
  templateUrl: './deposit-history.html',
  styleUrl: './deposit-history.scss'
})
export class DepositHistory implements OnInit {
  depositHistory: any[] = [];
  selectedDeposit: any = null;
  showCurrentDeposit = false;
  email = '';
  isLoading = false;

  constructor(private depositService: Deposit) {}

  ngOnInit(): void {
    this.getUserDepositList();
  }

  get totalAmount(): number {
    return this.depositHistory.reduce((sum, d) => sum + (Number(d.depositAmount) || 0), 0);
  }

  fetchUserUserData(): void {
    const localData = localStorage.getItem('user');
    const userData = JSON.parse(localData || '{}');
    const user = userData?.data?.user || null;
    this.email = user?.email || '';
  }

  getUserDepositList(): void {
    this.isLoading = true;
    this.fetchUserUserData();
    this.depositService.getDepositHistory(this.email).subscribe({
      next: (res) => {
        this.depositHistory = res.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openDialog(deposit: any): void {
    this.selectedDeposit = deposit;
    this.showCurrentDeposit = true;
  }

  closeDepositDialog(): void {
    this.showCurrentDeposit = false;
    this.selectedDeposit = null;
  }

  copyText(value: string, event: Event): void {
    event.stopPropagation();
    if (value) {
      navigator.clipboard.writeText(value);
    }
  }

  getStatusClass(status?: string): string {
    const normalized = (status || 'Pending').toLowerCase();
    if (normalized === 'completed') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
    }
    if (normalized === 'pending') {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
    }
    return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
  }
}
