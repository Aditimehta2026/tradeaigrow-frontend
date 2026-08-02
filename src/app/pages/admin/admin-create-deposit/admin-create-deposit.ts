import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '@ngx-translate/core';
import { Admin } from '@/pages/service/admin';

@Component({
  selector: 'app-admin-create-deposit',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    FluidModule,
    ProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './admin-create-deposit.html',
  styleUrl: './admin-create-deposit.scss',
  providers: [MessageService]
})
export class AdminCreateDeposit implements OnInit {
  isLoading = false;
  isSubmitting = false;
  userEmails: string[] = [];

  form = {
    email: '',
    coin: '',
    depositAmount: null as number | null,
    status: 'Completed',
    depositDate: this.toDatetimeLocalValue(new Date()),
    address: '',
    network: 'Ethereum',
    txid: 'processing',
    wallet: 'spot'
  };

  statusOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' }
  ];

  coinOptions = ['BTC', 'ETH', 'USDT(BEP20)', 'USDT(TRC20)', 'BNB', 'XRP', 'USDC', 'SOL', 'DOGE', 'LTC'];
  networkOptions = ['Ethereum', 'Bitcoin', 'BSC', 'TRON', 'Solana', 'Ripple', 'Litecoin', 'Dogecoin'];
  walletOptions = ['spot', 'funding'];

  constructor(
    private adminService: Admin,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get isFormValid(): boolean {
    return !!(
      this.form.email?.trim() &&
      this.form.coin?.trim() &&
      this.form.depositAmount !== null &&
      this.form.depositAmount > 0 &&
      this.form.status?.trim() &&
      this.form.address?.trim()
    );
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.userEmails = (res.data ?? []).map((u: any) => u.email).filter(Boolean);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.'
        });
      }
    });
  }

  submit(): void {
    if (!this.isFormValid || this.isSubmitting) return;

    this.isSubmitting = true;
    const payload = {
      email: this.form.email.trim(),
      coin: this.form.coin,
      depositAmount: this.form.depositAmount,
      status: this.form.status,
      depositDate: this.form.depositDate ? new Date(this.form.depositDate).toISOString() : undefined,
      address: this.form.address.trim(),
      network: this.form.network?.trim(),
      txid: this.form.txid?.trim(),
      wallet: this.form.wallet?.trim()
    };

    this.adminService.createDeposit(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Deposit created successfully.'
        });
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to create deposit.'
        });
      }
    });
  }

  resetForm(): void {
    this.form = {
      email: '',
      coin: '',
      depositAmount: null,
      status: 'Completed',
      depositDate: this.toDatetimeLocalValue(new Date()),
      address: '',
      network: 'Ethereum',
      txid: 'processing',
      wallet: 'spot'
    };
  }

  private toDatetimeLocalValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
