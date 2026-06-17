import { CommonModule } from '@angular/common';
import { Component, Input, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { Router, RouterModule } from '@angular/router';
import { DashboardData } from '../../service/dashboard-data';
import { Subscription } from 'rxjs';

declare const TradingView: any;


@Component({
  selector: 'app-commodity-trading',
  imports: [CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ProgressBarModule,
    RouterModule],
  templateUrl: './commodity-trading.html',
  styleUrl: './commodity-trading.scss'
})
export class CommodityTrading {
  @Input() symbol: string = 'TVC:GOLD'; // Default to Bitcoin
  @Input() interval: string = 'D'; // D, W, M, 1, 5, 15, 30, 60, 240
  @Input() theme: 'light' | 'dark' = 'dark';
  @Input() height: number = 300;
  @Input() title: string = 'Multi-Asset Trading Chart';

  containerId: string = `tradingview_${Math.random().toString(36).substring(2, 11)}`;
  private scriptLoaded: boolean = false;
  private widgetInstance: any = null;

  currentSymbol: string = this.symbol;
  currentInterval: string = this.interval;

  // Card selection (default to first card - 60 seconds)
  selectedCardIndex: number = 0;

  // Input fields
  userEnteramount: any = '';
  userSelectedDirection: any = '';
  expectedReturn: any = 'Expected return';
  amountError: string = '';

  // Dialog
  showSuccessDialog: boolean = false;
  showCompletionDialog: boolean = false;
  isLoading: boolean = false;

  // Timer properties
  timerProgress: number = 0;
  timerSeconds: number = 0;
  totalSeconds: number = 0;
  private timerInterval: any = null;

  // Trade details for dialog
  tradeDetails: {
    symbol: string;
    coinname: string;
    timing: string;
    enteredAmount: number;
    time: string;
    direction: 'up' | 'down';
    returnAmount: number;
  } | null = null;

  // Track last trade for balance deduction
  lastTradeDirection: 'up' | 'down' | null = null;
  lastTradeAmount: number = 0;

  // Real-time balance from API
  currentBalance: number = 0;
  private userDataSubscription?: Subscription;

  coins = [
    { label: 'GOLD', value: 'OANDA:XAUUSD' },
    { label: 'SILVER', value: 'OANDA:XAGUSD' },
    { label: 'PLATINUM', value: 'OANDA:XPTUSD' },
    { label: 'PALLADIUM', value: 'OANDA:XPDUSD' },
    { label: 'WTI OIL', value: 'TVC:USOIL' },
    { label: 'BRENT', value: 'TVC:UKOIL' }
  ];

  returnCards = [
    { time: '30 Seconds', return: '20.00%', min: 5000, max: 20000, returnPercent: 20, seconds: 30 },
    { time: '60 Seconds', return: '30.00%', min: 20000, max: 50000, returnPercent: 30, seconds: 60 },
    { time: '90 Seconds', return: '40.00%', min: 50000, max: 100000, returnPercent: 40, seconds: 90 },
    { time: '120 Seconds', return: '60.00%', min: 100000, max: 500000, returnPercent: 60, seconds: 120 }
    // { time: '180 Seconds', return: '40.00%', min: 120000, max: 180000, returnPercent: 40, seconds: 180 }
  ];
  

  // api respone for trade
  apiuserBlance: number = 0;
  apiuserProfit: string = 'down';
  apiuserEmail: string = '';

  // button
  isTradeButtonDisabled: boolean = true;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dashboardData: DashboardData
  ) { }

  ngAfterViewInit(): void {
    this.currentSymbol = this.symbol;
    this.currentInterval = this.interval;
    this.loadTradingViewScript();

    // Subscribe to user data from API
    this.userDataSubscription = this.dashboardData.userData$.subscribe((userData) => {
      if (userData) {
        const dashboardData = userData?.dashboardData || userData;
        this.currentBalance = Number(dashboardData?.balance ?? 0);
      }
    });

    // Fetch balance from API
    this.fetchUserData();
  }

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
  // get the user data for trade
  private fetchUserData(): void {
    const email = this.getUserEmail();
    if (email) {
      this.dashboardData.getUserData(email).subscribe({
        next: (res) => {
          this.apiuserBlance = Number(res?.dashboardData?.balance ?? 0);
          this.apiuserProfit = res?.dashboardData?.profit ?? 'down';
          this.apiuserEmail = res?.dashboardData?.email ?? '';
          // console.log(this.apiuserBlance ,this.apiuserEmail ,this.apiuserProfit);
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    }
  }


  getSymbolDisplay(symbol: string): string {
    const parts = symbol.split(':');
    if (parts.length > 1) {
      return parts[1];
    }
    return symbol;
  }

  // Helper method for Math.round in template
  round(value: number): number {
    return Math.round(value);
  }

  // the card intial selected values with index
  selectCard(index: number): void {
    this.selectedCardIndex = index;
    this.userEnteramount = '';
    this.expectedReturn = '$0.00';
    this.amountError = '';
  }

  // trade button validation
  tradeButtonValidation(): void {
    const raw = this.userEnteramount;
    const amountNum = Number(raw);

    // disable if empty, null/undefined, 0, negative, or not a number
    this.isTradeButtonDisabled =
      raw === '' ||
      raw === null ||
      raw === undefined ||
      Number.isNaN(amountNum) ||
      amountNum <= 0;
  }

  // Calculate expected return based on user input and selected card
  onAmountChange(): void {

    this.tradeButtonValidation();


    this.amountError = '';
    const amountNum = parseFloat(this.userEnteramount);
    const selectedCard = this.returnCards[this.selectedCardIndex];

    // Validate amount range
    if (amountNum < selectedCard.min || amountNum > selectedCard.max) {
      this.amountError = `Amount must be between ${selectedCard.min.toLocaleString()} and ${selectedCard.max.toLocaleString()}`;
      this.expectedReturn = '$0.00';
      return;
    }
    const userEnteredAmount = amountNum;
    const returnAmount = (userEnteredAmount * selectedCard.returnPercent) / 100;
    // Show only the return amount, not the total
    this.expectedReturn = `$${returnAmount.toFixed(2)}`;
    this.amountError = '';

    // console.log(userEnteredAmount, returnAmount);

  }

  checkBalanceAndTrade(direction: any): void {

    // Fetch fresh balance from API before trade
    this.fetchUserData();

    const userCurrentBalance = this.apiuserBlance;

    // If no balance, clear both fields
    if (!userCurrentBalance || userCurrentBalance === 0) {
      this.userEnteramount = '';
      this.expectedReturn = '';
      this.amountError = 'insufficient balance add money to your account';
      return;
    }


    // Remove any non-numeric characters except decimal point
    const numericValue = this.userEnteramount;
    const enteredAmountNumber = parseFloat(numericValue);
    const selectedCard = this.returnCards[this.selectedCardIndex];

    // Validate amount is within the selected card's range
    if (enteredAmountNumber < selectedCard.min || enteredAmountNumber > selectedCard.max) {
      this.amountError = `Amount must be between ${selectedCard.min.toLocaleString()} and ${selectedCard.max.toLocaleString()}`;
      return;
    }

    // Check if balance is sufficient for the trade
    // Balance should be >= minimum required for the card AND >= entered amount
    if (userCurrentBalance >= selectedCard.min && userCurrentBalance >= enteredAmountNumber) {
      // Show loader
      this.isLoading = true;

      // Calculate trade details
      const dollarAmount = enteredAmountNumber;
      const returnAmount = (dollarAmount * selectedCard.returnPercent) / 100;
      console.log(returnAmount);


      // Store trade information
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

      // console.log("trade data", this.tradeDetails , "entered value" ,enteredAmountNumber , "return amount",returnAmount ,"user balance" ,userCurrentBalance);

      // Simulate loading delay (you can remove this if not needed)
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

    // Clear any existing timer
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
            // Timer completed - deduct balance and navigate
            this.onTimerComplete();
          }
        });
      }, 1000);
    });
  }

  onTimerComplete(): void {
    // Update balance and profit via API
    if (this.tradeDetails) {
      this.updateBalanceViaAPI();
    }
    // Close the trade progress dialog
    this.showSuccessDialog = false;
    // Show completion dialog
    this.showCompletionDialog = true;
  }

  // trade start here
  onStartSpotTrade(data: any) {
    const direction = data == 'down' ? 'down' : 'up';
    this.userSelectedDirection = direction;
    this.checkBalanceAndTrade(direction);
  }

  closeSuccessDialog(): void {
    // Clear timer if still running
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.showSuccessDialog = false;
    // Don't navigate here anymore - navigation happens in onMoveToDashboard
    // Reset fields
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    // Reset trade tracking
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;
  }

  onTryAgain(): void {
    // Close completion dialog
    this.showCompletionDialog = false;
    // Reset fields but stay on same page
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    // Reset trade tracking
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;
    // Clear timer if still running
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  onMoveToDashboard(): void {
    // Close completion dialog
    this.showCompletionDialog = false;
    // Navigate to dashboard
    this.router.navigate(['/app/dashboard']);
    // Reset all fields
    this.userEnteramount = '';
    this.expectedReturn = '';
    this.amountError = '';
    // Reset trade tracking
    this.userSelectedDirection = null;
    this.lastTradeAmount = 0;
    this.tradeDetails = null;
    this.timerProgress = 0;
    this.timerSeconds = 0;
    // Clear timer if still running
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }


  private updateBalanceViaAPI(): void {
    const email = this.apiuserEmail;;
    if (!email || !this.tradeDetails) return;

    // Get current balance from API before calculating
    const currentBalance = this.apiuserBlance;
    const tradeAmount = Number(this.tradeDetails.enteredAmount || 0);
    const returnAmount = Number(this.tradeDetails.returnAmount || 0);
    const direction = this.userSelectedDirection;


    // Get profit type from localStorage user data
    const profitType = this.apiuserProfit;
    const newBalance = profitType === 'up' ? currentBalance + returnAmount : Math.max(0, currentBalance - returnAmount)


    console.log("entered value", tradeAmount, "return amount", returnAmount, "user balance", currentBalance, "profitype", profitType, 'AFTER Profit balance', newBalance);


    // Get coin name from symbol (e.g., "BINANCE:BTCUSDT" -> "BTC")
    const coinname = this.getCoinName(this.currentSymbol);

    // Get timing from selected card
    const selectedCard = this.returnCards[this.selectedCardIndex];
    const timing = selectedCard.time;

    // Get current date
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
    }
    // console.log(payload);


    this.dashboardData.updateCommodityTrade(payload).subscribe({
      next: (res) => {
        console.log('Trade data updated successfully:', res);
      },
      error: (err) => {
        console.error('Error updating trade data:', err);
      }
    });
  }

  // Helper method to extract coin name from symbol
  private getCoinName(symbol: string): string {
    const coin = this.coins.find(c => c.value === symbol);
    if (coin) return coin.label;
    const parts = symbol.split(':');
    return parts.length > 1 ? parts[1] : symbol;
  }

  changeSymbol(symbol: string): void {
    if (this.currentSymbol === symbol) {
      return; // Already selected
    }

    this.currentSymbol = symbol;
    this.initWidget();
  }

  changeInterval(interval: string): void {
    if (this.currentInterval === interval) {
      return; // Already selected
    }

    this.currentInterval = interval;
    this.initWidget();
  }

  private loadTradingViewScript(): void {
    // Check if script already exists
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

    // Wait a bit for the container to be ready
    setTimeout(() => {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.error('Container not found:', this.containerId);
        return;
      }

      // Clear any existing widget
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

  ngOnDestroy(): void {
    // Clear timer if still running
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Unsubscribe from user data
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }

    // Clean up widget instance if needed
    if (this.widgetInstance) {
      const container = document.getElementById(this.containerId);
      if (container) {
        container.innerHTML = '';
      }
    }
  }

}
