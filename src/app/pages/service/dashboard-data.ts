import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject, map } from 'rxjs';
import { Apiservice } from '@/service/apiservice';

export type MarketType = 'crypto' | 'forex' | 'commodities';

@Injectable({
    providedIn: 'root'
})
export class DashboardData {


    // BehaviorSubject for user data
    private userDataSubject = new BehaviorSubject<any>(null);
    public userData$ = this.userDataSubject.asObservable();
    // BehaviorSubject for trade history
    private tradeHistorySubject = new BehaviorSubject<any>(null);
    public tradeHistory$ = this.tradeHistorySubject.asObservable();
    private mapYahooToTable(rows: any[]) {
        return rows.map((r) => {
            const closes = r.sparkline || [];
            const last = closes[closes.length - 1];
            const prev = closes[closes.length - 2];
            return {
                name: r.name,
                symbol: r.symbol,
                flags: r.flags || [],
                current_price: r.latest?.close ?? last ?? null,
                sparkline_in_7d: { price: closes },
                price_change_percentage_24h:
                    last != null && prev ? ((last - prev) / prev) * 100 : null,
            };
        });
    }

    constructor(private apiService: Apiservice) { }
    getMarketData(type: MarketType): Observable<any> {
        return this.apiService.get<any>('market-data/type', { type }).pipe(
            map((res: any) => {
                const data = res?.data || [];
                // crypto already CoinGecko shape from your API
                if (type === 'crypto') return data;
                // forex / commodities → table shape
                return this.mapYahooToTable(data);
            }),
            tap((rows) => localStorage.setItem(`tableData_${type}`, JSON.stringify(rows)))
        );
    }

    getUserData(userEmail: string): Observable<any> {
        return this.apiService.post(`user/dashboard`, { email: userEmail }).pipe(
            tap((res) => {
                // Emit to subscribers  
                this.userDataSubject.next(res);
            })
        );
    }

    getCurrentUserData(): any {
        return this.userDataSubject.value;
    }

    updateUserBalanceAndProfit(payload: any): Observable<any> {
        return this.apiService.post<any>('spot-trade/create', payload).pipe(
            tap(() => {
                // Refresh user data after update
                this.getUserData(payload.email).subscribe();
            })
        );
    }

    updateCommodityTrade(payload: any): Observable<any> {
        return this.apiService.post<any>('commodity-trade/create', payload).pipe(
            tap(() => {
                // Refresh user data after update
                this.getUserData(payload.email).subscribe();
            })
        );
    }

    getTradeHistory(email: string): Observable<any> {
        return this.apiService.post(`spot-trade/list`, { email: email }).pipe(
            tap((res) => {
                // Emit to subscribers
                this.tradeHistorySubject.next(res);
            })
        );
    }

    getCommodityTradeHistory(email: string): Observable<any> {
        return this.apiService.post(`commodity-trade/list`, { email });
    }

    getCurrentTradeHistory(): any {
        return this.tradeHistorySubject.value;
    }

    submitLoanApplication(payload: FormData): Observable<any> {
        return this.apiService.postFormData(`user/add/loan`, payload)
    }

    withdrawFunds(payload: any): Observable<any> {
        return this.apiService.post(`withdraw/create`, payload)
    }

    AIupdateUserBalance(payload: any): Observable<any> {
        console.log("AIupdateUserBalance", payload);

        return this.apiService.post(`user/update-balance/ai-trade`, payload)
    }

    AITradeDetailsUpdate(payload: any): Observable<any> {
        return this.apiService.post(`ai-trade/create`, payload)
    }

    verifyIdentity(payload: FormData): Observable<any> {
        return this.apiService.postFormData(`verification/add-identity`, payload);
    }
    getVerificationHistory(email: string): Observable<any> {
        return this.apiService.post(`verification/get-history`, { email });
    }


}