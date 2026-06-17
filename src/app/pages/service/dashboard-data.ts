import { Injectable } from '@angular/core';
import { Observable, tap,BehaviorSubject, of } from 'rxjs';
import { Apiservice } from '@/service/apiservice';
import { HttpClient } from '@angular/common/http';

// One coin item from the dashboard API
export interface DashboardCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    market_cap_rank: number;
    sparkline_in_7d?: {
        price: number[];
    };
}


@Injectable({
    providedIn: 'root'
})
export class DashboardData {
    private apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true"

// BehaviorSubject to share data between components
private coinsSubject = new BehaviorSubject<DashboardCoin[]>([]);
public coins$ = this.coinsSubject.asObservable();
    // BehaviorSubject for user data
    private userDataSubject = new BehaviorSubject<any>(null);
    public userData$ = this.userDataSubject.asObservable();
    // BehaviorSubject for trade history
    private tradeHistorySubject = new BehaviorSubject<any>(null);
    public tradeHistory$ = this.tradeHistorySubject.asObservable();

constructor(private apiService: Apiservice, private http: HttpClient) {
    // Load from localStorage on service initialization
    this.loadFromCache();
}
        getData(): Observable<any[]> {
            return this.http.get<any[]>(this.apiUrl).pipe(
                tap((res) => {
                    // Store in localStorage
                    localStorage.setItem('tableData', JSON.stringify(res));
                    // Emit to subscribers
                    this.coinsSubject.next(res);
                })
            );
        }

        private loadFromCache(): void {
            const cachedData = localStorage.getItem('tableData');
            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        this.coinsSubject.next(parsedData);
                    }
                } catch (e) {
                    console.error('Error parsing cached data:', e);
                }
            }
        }

        getCurrentCoins(): DashboardCoin[] {
            return this.coinsSubject.value;
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

        updateUserBalanceAndProfit(payload:any): Observable<any> {
            return this.apiService.post<any>('spot-trade/create', payload).pipe(
                tap(() => {
                    // Refresh user data after update
                    this.getUserData(payload.email).subscribe();
                })
            );
        }
        
        updateCommodityTrade(payload:any): Observable<any> {
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

        AIupdateUserBalance(payload:any): Observable<any> {
            console.log("AIupdateUserBalance",payload);
            
            return this.apiService.post(`user/update-balance/ai-trade`, payload)
        }

        AITradeDetailsUpdate(payload:any): Observable<any> {
            return this.apiService.post(`ai-trade/create`, payload)
        }

         verifyIdentity(payload: FormData): Observable<any> {
            return this.apiService.postFormData(`verification/add-identity`, payload);
        }
        getVerificationHistory(email: string): Observable<any> {
            return this.apiService.post(`verification/get-history`, { email });
        }


}