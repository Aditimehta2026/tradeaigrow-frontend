import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { Router, RouterModule } from '@angular/router';
import { DashboardData } from '@/pages/service/dashboard-data';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Authservice } from '@/pages/auth/service/authservice';



@Component({
    selector: 'app-withdrawal',
    imports: [CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        DialogModule,
        FluidModule,
        ProgressSpinnerModule,
        TranslatePipe,
        RouterModule,
        PasswordModule,
        SelectModule,
        InputNumberModule

    ],
    templateUrl: './withdrawal.html',
    styleUrl: './withdrawal.scss'
})
export class Withdrawal implements OnInit, OnDestroy {
  withdrawAmount: number | null = null;
  walletAddress = '';
  selectedCoin: any = null;
  selectedNetwork = '';
  showConfirmDialog = false;
  showSuccessDialog = false;
  showLimitDialog = false;
  showVerificationErrorDialog = false;
  withdrawalErrorDetails = '';
  verificationErrorMessage = '';
  verificationErrorSuggestion = '';
  isSubmitting = false;
  isVerifying = false;
  private userSub?: Subscription;

  availableBalance = 1250;
  readonly minWithdrawal = 10;
  readonly maxWithdrawal = 100000;

  securityPassword = '';

  coinsList = [
    { name: 'Tether', code: 'USDT', image: 'assets/demo/images/deposit/USDT.png', symbol: 'USDT' },
    { name: 'Bitcoin', code: 'BTC', image: 'assets/demo/images/deposit/BTC.png', symbol: 'BTC' },
    { name: 'Ethereum', code: 'ETH', image: 'assets/demo/images/deposit/ETH.png', symbol: 'ETH' },
    { name: 'USD Coin', code: 'USDC', image: 'assets/demo/images/deposit/USDC.png', symbol: 'USDC' },
    { name: 'BNB', code: 'BNB', image: 'assets/demo/images/deposit/BNB.png', symbol: 'BNB' },
    { name: 'Solana', code: 'SOL', image: 'assets/demo/images/deposit/SOL.png', symbol: 'SOL' }
  ];

  networkMap: Record<string, string[]> = {
    USDT: ['ERC20 (Ethereum)', 'TRC20 (TRON)', 'BEP20 (BSC)'],
    BTC: ['Bitcoin'],
    ETH: ['Ethereum'],
    USDC: ['ERC20 (Ethereum)', 'BEP20 (BSC)'],
    BNB: ['BEP20 (BSC)'],
    SOL: ['Solana']
  };

  networkOptions: string[] = [];

  constructor(
    private router: Router,
    private dashboardData: DashboardData,
    private authService: Authservice
  ) {}

  ngOnInit(): void {
    this.selectedCoin = this.coinsList[0];
    this.onCoinChange(this.selectedCoin);
    this.loadUserBalance();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  loadUserBalance(): void {
    const stored = localStorage.getItem('balance');
    if (stored) {
      this.availableBalance = Number(stored) || this.availableBalance;
    }

    this.userSub = this.dashboardData.userData$.subscribe((userData) => {
      if (userData) {
        const dashboardData = userData?.dashboardData || userData;
        this.availableBalance = Number(dashboardData?.balance ?? this.availableBalance);
      }
    });

    const user = localStorage.getItem('user');
    const userData = JSON.parse(user || '{}');
    const email = userData.data?.user?.email;
    if (email) {
      this.dashboardData.getUserData(email).subscribe();
    }
  }

  onCoinChange(coin: any): void {
    if (!coin) {
      this.networkOptions = [];
      this.selectedNetwork = '';
      return;
    }
    this.networkOptions = this.networkMap[coin.code] || [];
    this.selectedNetwork = this.networkOptions[0] || '';
  }

  setMaxAmount(): void {
    this.withdrawAmount = Math.min(this.availableBalance, this.maxWithdrawal);
  }

  get networkFee(): number {
    const amount = Number(this.withdrawAmount) || 0;
    if (!amount) return 0;

    const code = this.selectedCoin?.code || 'USDT';
    if (code === 'BTC') return 0.0004;
    if (code === 'ETH') return 0.002;
    if (code === 'SOL') return 0.01;
    return Math.max(amount * 0.001, 1);
  }

  get receiveAmount(): number {
    const amount = Number(this.withdrawAmount) || 0;
    return Math.max(amount - this.networkFee, 0);
  }

  get userEmail(): string {
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user || '{}');
    return userData.data?.user?.email || '';
  }

  get isFormValid(): boolean {
    const amount = Number(this.withdrawAmount);
    const hasValidAmount =
      amount > 0 &&
      amount >= this.minWithdrawal &&
      amount <= this.maxWithdrawal &&
      amount <= this.availableBalance;

    const hasValidAddress = Boolean(this.walletAddress?.trim());
    const hasCoin = Boolean(this.selectedCoin);
    const hasNetwork = Boolean(this.selectedNetwork);
    const hasPassword = this.securityPassword.trim().length >= 6;

    return hasValidAmount && hasValidAddress && hasCoin && hasNetwork && hasPassword;
  }

  authenticateWithdrawal(): void {
    if (!this.isFormValid || this.isVerifying) return;
    this.verifyPassword();
  }

  verifyPassword(): void {
    this.isVerifying = true;
    this.authService.login({
      email: this.userEmail,
      password: this.securityPassword.trim()
    }).subscribe({
      next: () => {
        this.isVerifying = false;
        this.showConfirmDialog = true;
      },
      error: (err) => {
        this.isVerifying = false;
        this.showVerificationError(
          err.error?.message || 'Incorrect password. Please try again.',
          err.error?.suggestion || 'The password you entered does not match your account. Please check and try again.'
        );
        this.securityPassword = '';
      }
    });
  }

  showVerificationError(message: string, suggestion: string): void {
    this.verificationErrorMessage = message;
    this.verificationErrorSuggestion = suggestion;
    this.showVerificationErrorDialog = true;
  }

  closeVerificationErrorDialog(): void {
    this.showVerificationErrorDialog = false;
    this.verificationErrorMessage = '';
    this.verificationErrorSuggestion = '';
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }

  confirmWithdrawal(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const payload = {
      email: this.userEmail,
      withdrawAmount: this.withdrawAmount,
      walletAddress: this.walletAddress.trim(),
      coin: this.selectedCoin?.code,
      network: this.selectedNetwork
    };

    this.dashboardData.withdrawFunds(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showConfirmDialog = false;
        this.resetForm();
        this.showSuccessDialog = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showConfirmDialog = false;
        this.withdrawalErrorDetails =
          err.error?.message || `Today's withdrawal limit has been reached. Please try again later.`;
        this.showLimitDialog = true;
      }
    });
  }

  onDialogOk(): void {
    this.showSuccessDialog = false;
    this.router.navigate(['/app/dashboard']);
  }

  goToHistory(): void {
    this.showSuccessDialog = false;
    this.router.navigate(['/app/page/withdrawal-history']);
  }

  resetForm(): void {
    this.walletAddress = '';
    this.withdrawAmount = null;
    this.securityPassword = '';
    this.onCoinChange(this.selectedCoin);
  }

  dismissLoanPopups(): void {
    this.showSuccessDialog = false;
    this.showLimitDialog = false;
    this.withdrawalErrorDetails = '';
  }

  onMoveToSupport(): void {
    this.dismissLoanPopups();
    this.router.navigate(['/app/page/support']);
  }

  closeDialog(): void {
    this.dismissLoanPopups();
  }
}
