import { Component,NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterModule, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardData } from '@/pages/service/dashboard-data';
import { ForexTrade } from '@/pages/service/forex-trade';

declare const TradingView: any;

@Component({
  selector: 'app-forex-trade-form',
  imports: [CommonModule, FormsModule, ButtonModule, RippleModule, InputTextModule, InputNumberModule, DialogModule, ProgressBarModule, RouterModule, TranslatePipe],
  templateUrl: './forex-trade-form.html',
  styleUrl: './forex-trade-form.scss'
})
export class ForexTradeForm {
  // ===== Chart / TradingView =====
  symbol: string = 'FX:EURUSD';
  interval: string = 'D';
  theme: 'light' | 'dark' = 'dark';
  height: number = 300;
  title: string = 'Forex Trade Chart';

  containerId: string = `tradingview_${Math.random().toString(36).substring(2, 11)}`;
  private scriptLoaded: boolean = false;
  private widgetInstance: any = null;
  currentSymbol: string = this.symbol;
  currentInterval: string = this.interval;
  showDisclaimerDialog: boolean = false;

  forexPairs = [
    { base: 'EUR', quote: 'USD', value: 'FX:EURUSD' },
    { base: 'GBP', quote: 'USD', value: 'FX:GBPUSD' },
    { base: 'USD', quote: 'JPY', value: 'FX:USDJPY' },
    { base: 'AUD', quote: 'USD', value: 'FX:AUDUSD' },
    { base: 'USD', quote: 'CAD', value: 'FX:USDCAD' },
    { base: 'USD', quote: 'CHF', value: 'FX:USDCHF' },
    { base: 'NZD', quote: 'USD', value: 'FX:NZDUSD' },
    { base: 'EUR', quote: 'GBP', value: 'FX:EURGBP' }
  ];

  // ===== Trade form =====
  selectedCardIndex: number = 0;
  returnCards = [
    { time: '30 Seconds', return: '5.00%', min: 200, max: 4000, returnPercent: 5, seconds: 30 },
    { time: '60 Seconds', return: '10.00%', min: 4000, max: 20000, returnPercent: 10, seconds: 60 },
    { time: '90 Seconds', return: '20.00%', min: 20000, max: 60000, returnPercent: 20, seconds: 90 },
    { time: '120 Seconds', return: '30.00%', min: 60000, max: 180000, returnPercent: 30, seconds: 120 }
  ];

  userEnteramount: any = '';
  expectedReturn: any = 'Expected return';
  amountError: string = '';
  userSelectedDirection: any = '';
  isTradeButtonDisabled: boolean = true;
  lastTradeAmount: number = 0;

  // ===== API user =====
  apiuserBlance: number = 0;
  apiuserProfit: string = 'down';
  apiuserEmail: string = '';

  // ===== Loading / Dialogs / Timer =====
  isLoading: boolean = false;
  showSuccessDialog: boolean = false;
  showCompletionDialog: boolean = false;
  timerProgress: number = 0;
  timerSeconds: number = 0;
  totalSeconds: number = 0;
  private timerInterval: any = null;

  tradeDetails: {
    symbol: string;
    coinname: string;
    timing: string;
    enteredAmount: number;
    time: string;
    direction: 'up' | 'down';
    returnAmount: number;
  } | null = null;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dashboardData: DashboardData,
    private forexTrade: ForexTrade
  ) {}

  // ===== Lifecycle =====
  ngAfterViewInit(): void {
    this.currentSymbol = this.symbol;
    this.currentInterval = this.interval;
    this.loadTradingViewScript();
    this.fetchUserData();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.widgetInstance) {
      const container = document.getElementById(this.containerId);
      if (container) {
        container.innerHTML = '';
      }
    }
  }

  // ===== User / API =====
  private getUserEmail(): string {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return '';
    try {
      const parsed = JSON.parse(storedUser);
      const user = parsed?.data?.user ?? parsed?.user ?? parsed;
      this.apiuserEmail = user?.email || '';
      return user?.email || '';
    } catch {
      return '';
    }
  }

  private fetchUserData(): void {
    const email = this.getUserEmail();
    if (email) {
      this.dashboardData.getUserData(email).subscribe({
        next: (res) => {
          this.apiuserBlance = Number(res?.dashboardData?.balance ?? 0);
          this.apiuserProfit = res?.dashboardData?.profit ?? 'down';
          this.apiuserEmail = res?.dashboardData?.email ?? '';
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
  }

  // ===== Form UI =====
  selectCard(index: number): void {
    this.selectedCardIndex = index;
    this.userEnteramount = '';
    this.expectedReturn = '$0.00';
    this.amountError = '';
  }

  onAmountChange(): void {
    this.tradeButtonValidation();

    this.amountError = '';
    const amountNum = parseFloat(this.userEnteramount);
    const selectedCard = this.returnCards[this.selectedCardIndex];

    if (amountNum < selectedCard.min || amountNum > selectedCard.max) {
      this.amountError = `Amount must be between ${selectedCard.min.toLocaleString()} and ${selectedCard.max.toLocaleString()}`;
      this.expectedReturn = '$0.00';
      return;
    }

    const returnAmount = (amountNum * selectedCard.returnPercent) / 100;
    this.expectedReturn = `$${returnAmount.toFixed(2)}`;
    this.amountError = '';
  }

  tradeButtonValidation(): void {
    const raw = this.userEnteramount;
    const amountNum = Number(raw);

    this.isTradeButtonDisabled =
      raw === '' ||
      raw === null ||
      raw === undefined ||
      Number.isNaN(amountNum) ||
      amountNum <= 0;
  }

  getSymbolDisplay(symbol: string): string {
    // Convert FX:EURUSD to EUR/USD
    const parts = symbol.split(':');
    if (parts.length > 1) {
      const pair = parts[1];
      if (pair.length === 6) {
        return `${pair.slice(0, 3)}/${pair.slice(3)}`;
      }
      return pair;
    }
    return symbol;
  }

  private getCoinName(symbol: string): string {
    // Convert FX:EURUSD to EURUSD
    const parts = symbol.split(':');
    return parts.length > 1 ? parts[1] : symbol;
  }

  round(value: number): number {
    return Math.round(value);
  }

  // ===== Trade flow =====
  onStartForexTrade(data: any): void {
    const direction = data == 'down' ? 'down' : 'up';
    this.userSelectedDirection = direction;
    this.checkBalanceAndTrade(direction);
  }

  checkBalanceAndTrade(direction: any): void {
    this.fetchUserData();

    const userCurrentBalance = this.apiuserBlance;

    if (!userCurrentBalance || userCurrentBalance === 0) {
      this.userEnteramount = '';
      this.expectedReturn = '';
      this.amountError = 'insufficient balance add money to your account';
      return;
    }

    const enteredAmountNumber = parseFloat(this.userEnteramount);
    const selectedCard = this.returnCards[this.selectedCardIndex];

    if (enteredAmountNumber < selectedCard.min || enteredAmountNumber > selectedCard.max) {
      this.amountError = `Amount must be between ${selectedCard.min.toLocaleString()} and ${selectedCard.max.toLocaleString()}`;
      return;
    }

    if (userCurrentBalance >= selectedCard.min && userCurrentBalance >= enteredAmountNumber) {
      this.isLoading = true;

      const dollarAmount = enteredAmountNumber;
      const returnAmount = (dollarAmount * selectedCard.returnPercent) / 100;

      this.lastTradeAmount = enteredAmountNumber;

      this.tradeDetails = {
        symbol: this.getSymbolDisplay(this.currentSymbol),
        enteredAmount: dollarAmount,
        time: selectedCard.time,
        direction: direction,
        returnAmount: returnAmount,
        coinname: this.getCoinName(this.currentSymbol),
        timing: selectedCard.time
      };

      setTimeout(() => {
        this.isLoading = false;
        this.showSuccessDialog = true;
        this.startTimer(selectedCard.seconds);
        this.amountError = '';
      }, 500);
    } else if (userCurrentBalance < selectedCard.min) {
      this.amountError = `Insufficient balance. Minimum required: ${selectedCard.min.toLocaleString()}, Your balance: ${userCurrentBalance.toLocaleString()}`;
    } else if (userCurrentBalance < enteredAmountNumber) {
      this.amountError = `Insufficient balance. Required: ${enteredAmountNumber.toLocaleString()}, Your balance: ${userCurrentBalance.toLocaleString()}`;
    }
  }

  startTimer(totalSeconds: number): void {
    this.totalSeconds = totalSeconds;
    this.timerSeconds = totalSeconds;
    this.timerProgress = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.ngZone.runOutsideAngular(() => {
      this.timerInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.timerSeconds--;
          this.timerProgress = ((totalSeconds - this.timerSeconds) / totalSeconds) * 100;

          if (this.timerSeconds <= 0) {
            this.timerSeconds = 0;
            this.timerProgress = 100;
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.onTimerComplete();
          }
        });
      }, 1000);
    });
  }

  onTimerComplete(): void {
    if (this.tradeDetails) {
      this.updateBalanceViaAPI();
    }
    this.showSuccessDialog = false;
    this.showCompletionDialog = true;
  }

  private updateBalanceViaAPI(): void {
    const email = this.apiuserEmail;
    if (!email || !this.tradeDetails) return;

    const currentBalance = this.apiuserBlance;
    const tradeAmount = Number(this.tradeDetails.enteredAmount || 0);
    const returnAmount = Number(this.tradeDetails.returnAmount || 0);
    const direction = this.userSelectedDirection;
    const profitType = this.apiuserProfit;
    const newBalance = profitType === 'up' ? currentBalance + returnAmount : Math.max(0, currentBalance - returnAmount);

    console.log('entered value', tradeAmount, 'return amount', returnAmount, 'user balance', currentBalance, 'profitype', profitType, 'AFTER Profit balance', newBalance);

    const coinname = this.getCoinName(this.currentSymbol);
    const selectedCard = this.returnCards[this.selectedCardIndex];
    const timing = selectedCard.time;
    const date = new Date().toISOString();

    const payload = {
      email: email,
      balance: newBalance,
      todayPnl: profitType === 'up' ? returnAmount : -returnAmount,
      todayGain: profitType === 'up' ? returnAmount : -returnAmount,
      coinname: coinname,
      timing: timing,
      direction: direction,
      date: date,
      createdAt: new Date().toISOString()
    };

    this.forexTrade.createTrade(payload).subscribe({
      next: (res: any) => console.log('Forex trade created:', res),
      error: (err: any) => console.error('Error creating forex trade:', err)
    });
  }

  // ===== Dialogs =====
  closeSuccessDialog(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.showSuccessDialog = false;
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;
  }

  onTryAgain(): void {
    this.showCompletionDialog = false;
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onMoveToDashboard(): void {
    this.showCompletionDialog = false;
    this.router.navigate(['/app/dashboard']);
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ===== TradingView =====
  changeSymbol(symbol: string): void {
    if (this.currentSymbol === symbol) {
      return;
    }
    this.currentSymbol = symbol;
    this.initWidget();
  }

  private loadTradingViewScript(): void {
    if (document.getElementById('tradingview-widget-script')) {
      this.initWidget();
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      this.scriptLoaded = true;
      this.initWidget();
    };
    script.onerror = () => {
      console.error('Failed to load TradingView script');
    };

    document.head.appendChild(script);
  }

  private initWidget(): void {
    if (typeof TradingView === 'undefined') {
      console.error('TradingView is not loaded');
      return;
    }

    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.error('Container not found:', this.containerId);
        return;
      }

      container.innerHTML = '';

      this.widgetInstance = new TradingView.widget({
        container_id: this.containerId,
        symbol: this.currentSymbol,
        interval: this.currentInterval,
        timezone: 'Etc/UTC',
        theme: this.theme,
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_top_toolbar: false,
        save_image: false,
        height: this.height,
        width: '100%',
        autosize: true
      });
    }, 100);
  }
}
