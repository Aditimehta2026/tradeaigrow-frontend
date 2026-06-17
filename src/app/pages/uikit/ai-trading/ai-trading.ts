import { Component } from '@angular/core';
import { DashboardData } from '@/pages/service/dashboard-data';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs/operators';

interface AITradingData {
     period: string;
    amount: string;
    minAmount: number;
    maxAmount: number;
    daily_roi: string;
    duration: number;
    ROI: number;
}

const aitradingData: AITradingData[] = [
    { period: '5 Days AI Trade', amount: '2,000 - 10,000 USDT', minAmount: 2000, maxAmount: 10000, daily_roi: '0.6%', ROI:0.6, duration: 5 },
    { period: '15 Days AI Trade', amount: '10,000 - 50,000 USDT', minAmount: 10000, maxAmount: 50000, daily_roi: '0.9%', ROI:0.9, duration: 15 },
    { period: '30 Days AI Trade', amount: '50,000 - 100,000 USDT', minAmount: 50000, maxAmount: 100000, daily_roi: '1.2%', ROI:1.2, duration: 30 },
    { period: '60 Days AI Trade', amount: '100,000 - 200,000 USDT', minAmount: 100000, maxAmount: 200000, daily_roi: '1.5%', ROI:1.5, duration: 60 },
    { period: '120 Days AI Trade', amount: '200,000 - 500,000 USDT', minAmount: 200000, maxAmount: 500000, daily_roi: '2.2%', ROI:2.2, duration: 120 }
];


@Component({
  selector: 'app-ai-trading',
  imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, DialogModule, InputNumberModule,ProgressSpinnerModule],
  templateUrl: './ai-trading.html',
  styleUrl: './ai-trading.scss'
})
export class AiTrading {
   aitradingData: AITradingData[] = [];
    // Crypto coin images - you can replace these with actual image paths
    cryptoCoins = [
        { name: 'GOLD', image: 'assets/demo/images/deposit/GOLD.jpg' },
        { name: 'ETH', image: 'assets/demo/images/deposit/ETH.png' },
        { name: 'BTC', image: 'assets/demo/images/deposit/BTC.png' },
        { name: 'BNB', image: 'assets/demo/images/deposit/BNB.png' },
        { name: 'USDT', image: 'assets/demo/images/deposit/USDT.png' },
        { name: 'SOL', image: 'assets/demo/images/deposit/SOL.png' },
        { name: 'XRP', image: 'assets/demo/images/deposit/XRP.png' }
    ];

    selectedTradingPlanPopUpData: AITradingData | null = null;
    AIPlanPopUpVisible: boolean = false;
    userAiEnteredAmount: number | null = null;

    isStartAiTradingButton: boolean = true;
    amountError: boolean = false;
    amountErrorMessage: string = '';
    email: string = '';

    showAITradeSuccessDialog: boolean = false;
    AITradeSuccessMessage: string = '';
     isLoading = false;

    constructor(private router: Router, private dashboardData: DashboardData) { }

    ngOnInit() {
        this.aitradingData = aitradingData;
    }
    // Get number of images for each card: 1, 3, 4, 5, 6
    getImageCount(index: number): number {
        const counts = [1, 3, 4, 5, 6];
        return counts[index] || 1;
    }

    // Get images to display for a specific card
    getImagesForCard(index: number) {
        const count = this.getImageCount(index);
        return this.cryptoCoins.slice(0, count);
    }

    selectTradingPlan(data: any) {
        this.selectedTradingPlanPopUpData = data;
        this.AIPlanPopUpVisible = true;

        this.userAiEnteredAmount = null;
        this.isStartAiTradingButton = true;
        this.amountError = false;
        this.amountErrorMessage = '';
    }
    onTryAgain() {
        this.AIPlanPopUpVisible = false;
        this.resetValues();
    }

    fetchUserUserData() {
        const localData = localStorage.getItem('user');
        const userData = JSON.parse(localData || '{}');
        const user = userData?.data?.user || null;
        const userBalance = user?.balance || 0;
        this.email = user?.email || '';
        return userBalance;
    }

   startAiTrade() {
    this.fetchUserUserData();
    const email = this.email;
    const enteredAmount = this.userAiEnteredAmount ?? 0;
    const plan = this.selectedTradingPlanPopUpData;

    if (!plan || enteredAmount < plan.minAmount || enteredAmount > plan.maxAmount) {
        this.amountError = true;
        this.amountErrorMessage = plan
            ? `Please enter amount between ${plan.minAmount.toLocaleString()} and ${plan.maxAmount.toLocaleString()} USDT.`
            : 'Please select a trading plan.';
        this.userAiEnteredAmount = null;
        this.isStartAiTradingButton = true;
        return;
    }

    this.isLoading = true;

    this.dashboardData.getUserData(email)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(
            (res: any) => {
                const userBalance = Number(res?.dashboardData?.balance ?? 0);

                if (enteredAmount > userBalance) {
                    this.amountError = true;
                    this.amountErrorMessage =
                        'Insufficient Balance to Start AI Trade. Please check your balance and try again.';
                    this.userAiEnteredAmount = null;
                    return;
                }
                const totalProfit = enteredAmount * (plan.ROI / 100) * plan.duration;
                const finalAmount = enteredAmount + totalProfit;
                const newBalance = userBalance - enteredAmount;

                 const payload = {
                    tradeDuration: plan.period,
                    investedAmount: enteredAmount,
                    balanceBeforeAITrade: userBalance,
                    balanceAfterAITrade: newBalance,
                    dailyAIROI: plan.ROI,
                    email: email,
                    numberOfDaysOfAITrade: plan.duration,
                    strategyProfit: totalProfit,
                    projectedPayout: finalAmount
                };

                this.isLoading = true;
                this.dashboardData.AITradeDetailsUpdate(payload)
                    .pipe(finalize(() => (this.isLoading = false)))
                    .subscribe(
                        (response: any) => {
                            this.AIPlanPopUpVisible = false;
                            this.AITradeSuccessMessage = response?.message || 'AI Trade Started Successfully';
                            this.showAITradeSuccessDialog = true;
                            this.resetValues();

                            // Refresh so next trade uses latest balance
                            this.dashboardData.getUserData(email).subscribe();
                        },
                        (error: any) => {
                            this.amountError = true;
                            this.amountErrorMessage =
                                error?.error?.message ||
                                error?.message ||
                                'Failed to Start AI Trade. Please try again.';
                        }
                    );

                this.userAiEnteredAmount = null;
            },
            () => {
                this.amountError = true;
                this.amountErrorMessage = 'Failed to fetch latest balance. Please try again.';
                this.userAiEnteredAmount = null;
            }
        );
}

    tryAgain() {
        this.showAITradeSuccessDialog = false;
        this.AITradeSuccessMessage = '';
        this.AIPlanPopUpVisible = true;
    }

    moveToDashboard() {
        this.showAITradeSuccessDialog = false;
        this.AITradeSuccessMessage = '';
        this.router.navigate(['/app/dashboard']);
    }
    resetValues() {
        this.userAiEnteredAmount = null;
        this.amountErrorMessage = "";
        this.amountError = false;
    }
    validateAmount(value: number | null) {
        const plan = this.selectedTradingPlanPopUpData;
        if (!plan || value == null) {
            this.isStartAiTradingButton = true;
            this.amountError = true;
            this.amountErrorMessage = 'Please enter an amount.';
            return;
        }

        const isValidRange = value >= plan.minAmount && value <= plan.maxAmount;
        this.isStartAiTradingButton = !isValidRange;
        this.amountError = !isValidRange;
        this.amountErrorMessage = isValidRange
            ? ''
            : `Please enter amount between ${plan.minAmount.toLocaleString()} and ${plan.maxAmount.toLocaleString()} USDT.`;
    }

}
