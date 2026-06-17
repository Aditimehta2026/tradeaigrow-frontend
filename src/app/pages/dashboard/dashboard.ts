import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { DashboardData } from '../service/dashboard-data';
import { AccountBalanceHeader } from './components/account-balance-header/account-balance-header';

@Component({
    selector: 'app-dashboard',
    imports: [ RecentSalesWidget, NotificationsWidget,AccountBalanceHeader],
    templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
    dashboardDatas: any[] = [];
    userData: any[] = [];
    selectedCoinSymbol: string = 'BINANCE:BTCUSDT'; // Default symbol

    constructor(private dashboardData: DashboardData) {}

    ngOnInit() {
        this.getUserData();
        this.gettableData();

    }

    gettableData() {
        this.dashboardData.getData().subscribe({
            next: (res) => {
                // this.dashboardDatas = res;
                console.log("table data", res);
            },
            error: (err) => {
                console.warn('API error:', err);
            }
        });
    }

    // Method to convert coin symbol to TradingView format
    getTradingViewSymbol(coinId: string, symbol: string): string {
        // Map common crypto symbols to TradingView format
        const symbolMap: { [key: string]: string } = {
            'btc': 'BINANCE:BTCUSDT',
            'eth': 'BINANCE:ETHUSDT',
            'bnb': 'BINANCE:BNBUSDT',
            'sol': 'BINANCE:SOLUSDT',
            'xrp': 'BINANCE:XRPUSDT',
            'doge': 'BINANCE:DOGEUSDT',
            'trx': 'BINANCE:TRXUSDT',
            'usdt': 'BINANCE:USDTUSDT',
            'usdc': 'BINANCE:USDCUSDT'
        };
        
        return symbolMap[symbol.toLowerCase()] || `BINANCE:${symbol.toUpperCase()}USDT`;
    }

  
    getUserData() {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user || '{}');
        const userEmail = userData.data.user.email;
        
        // This will trigger the API call and update the BehaviorSubject
        this.dashboardData.getUserData(userEmail).subscribe({
            next: (res) => {
                console.log("user data", res);
                
                // Data is automatically shared via BehaviorSubject
                // No need to store in component if not needed here
            },
            error: (err) => {
                console.warn('API error:', err);
            }
        });
    }
}