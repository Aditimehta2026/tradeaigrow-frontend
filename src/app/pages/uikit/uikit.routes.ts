import { Routes } from '@angular/router';
import { AiTradeHistory } from './ai-trade-history/ai-trade-history';
import { DepositHistory } from './deposit-history/deposit-history';
import { WithdrawalHistory } from './withdrawal-history/withdrawal-history';
import { AiTrading } from './ai-trading/ai-trading';
import { Withdrawal } from './withdrawal/withdrawal';
import { CommodityTrading } from './commodity-trading/commodity-trading';
import { MultiassetTradeHistory } from './multiasset-trade-history/multiasset-trade-history';
import { UpcomingEvents } from './upcoming-events/upcoming-events';
import { Deposit } from './deposit/deposit';
import { SpotTrade } from './spot-trade/spot-trade';
import { SpotTradeHistory } from './spot-trade-history/spot-trade-history';
import { Loan } from './loan/loan';
import { Support } from './support/support';
import { ForexTradeForm } from './forex-trade-form/forex-trade-form';
import { ForexTradeHistory } from './forex-trade-history/forex-trade-history';

export default [
    { path: 'deposit', data: { breadcrumb: 'Deposit' }, component: Deposit },
    { path: 'deposit-history', data: { breadcrumb: 'Deposit History' }, component: DepositHistory },
    { path: 'withdrawal-history', data: { breadcrumb: 'Withdrawal History' }, component: WithdrawalHistory },
    { path: 'forex-trade', data: { breadcrumb: 'Forex Trade' }, component: ForexTradeForm },
    { path: 'forex-trade-history', data: { breadcrumb: 'Forex Trade History' }, component: ForexTradeHistory },
    { path: 'support', data: { breadcrumb: 'Support' }, component: Support },
    { path: 'ai-trading', data: { breadcrumb: 'AI Trading' }, component: AiTrading },
    { path: 'ai-trade-history', data: { breadcrumb: 'AI Trade History' }, component: AiTradeHistory },
    { path: 'commodity-trading', data: { breadcrumb: 'Commodity Trading' }, component: CommodityTrading },
    { path: 'multiasset-trade-history', data: { breadcrumb: 'Multiasset Trading History' }, component: MultiassetTradeHistory },
    { path: 'spot-trade', data: { breadcrumb: 'Spot Trade' }, component: SpotTrade },
    { path: 'withdraw', data: { breadcrumb: 'Withdraw' }, component: Withdrawal },
    { path: 'spot-trade-history', data: { breadcrumb: 'Spot Trade History' }, component: SpotTradeHistory },
    { path: 'upcoming-events', data: { breadcrumb: 'Upcoming Events' }, component: UpcomingEvents },
    { path: 'loan', data: { breadcrumb: 'Loan' }, component: Loan },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
