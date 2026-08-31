import { Component, OnInit, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../service/layout.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DashboardData } from '@/pages/service/dashboard-data';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@/core/services/language.service';
import { Notification } from '@/pages/service/notification';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [   RouterModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        DrawerModule,
        FormsModule,
        SelectButtonModule,
        SelectModule,
        FileUploadModule,
        InputTextModule,
        ProgressSpinnerModule,
        TranslatePipe
    ],
    templateUrl: './app.topbar.html',
    styleUrl: './app.topbar.scss'
})
export class AppTopbar implements OnInit {
    verifyFileUpload = viewChild<any>('verifyFileUpload');
    displayConfirmation = false;
    userName: any = '';
    balance: any = '0.00';
    userEmail: any = '';
    userUid: any = '';
    showProfileDrawer = false;
    showNotificationDrawer = false;
    notificationFilter: any = 'all';
    selectedRegion: any = 'UK';
    regionOptions: any[] = [
        { label: 'UK', value: 'UK' },
        { label: 'US', value: 'US' }
    ];
    isIdentityVerified = false;
    showVerifyDialog = false;
    documentType: any = null;
    documentNumber: any = '';
    documentTypeOptions: any[] = [
        { label: 'Passport', value: 'passport' },
        { label: 'Driver License', value: 'driver_license' },
        { label: 'National ID', value: 'national_id' },
        { label: 'Other', value: 'other' }
    ];
    showDocError = false;
    verificationStatus: any = 'pending';
    showVerifySuccessDialog = false;
    isLoading = false;
    showVerifyErrorDialog = false;
    verifyErrorMessage: any = '';
    selectedLang: any = 'en';
    showLanguageDialog = false;
    showUpdatesDialog = false;
    notifications: any[] = [];
    isNotificationsLoading = false;
    unreadNotificationCount: any = 0;
    readNotificationCount: any = 0;
    allNotificationCount: any = 0;
    showNotificationDialog = false;
    selectedNotification: any = null;
    readonly updateItems: any[] = [
        {
            id: 'tradeaigrow-arbitration',
            tag: 'Arbitration',
            title: 'Synchronous inter-exchange service is going live',
            paragraphs: [
                'Welcome to the TradeAiGrow synchronous inter-exchange service!',
                'All TradeAiGrow systems are ready to conduct secure transactions.',
                'We are finalizing the setup for TradeAiGrow partner cryptocurrency exchanges and adding external liquidity providers to exchanges in South America and Africa.',
                'Within a few days, all our clients will be able to activate arbitration operations and begin to consistently receive arbitration profits through TradeAiGrow.',
                'Now you can successfully register and get acquainted with the TradeAiGrow platform.',
                'Stay tuned for updates. The TradeAiGrow team is always happy to help. Thank you for your participation.'
            ]
        },
        {
            id: 'spot-trade',
            tag: 'Spot Trade',
            title: 'Spot trading with real-time market data',
            paragraphs: [
                'TradeAiGrow Spot Trade is now fully integrated with live price feeds across major crypto pairs.',
                'Execute market and limit orders with low latency, track open positions, and review your trade history from one unified dashboard.',
                'New chart tools and order-book depth views help you make faster decisions in volatile markets.'
            ]
        },
        {
            id: 'forex',
            tag: 'Forex',
            title: 'Forex desk expanded for UK and US regions',
            paragraphs: [
                'Our Forex module now supports extended sessions for GBP, EUR, and USD pairs with region-aware pricing.',
                'Switch between UK and US market profiles in your account settings to align spreads and session windows with your trading strategy.',
                'Historical performance charts and pip-based P&L summaries are available on the dashboard.'
            ]
        },
        {
            id: 'commodity',
            tag: 'Commodity',
            title: 'Commodity markets: gold, oil, and metals',
            paragraphs: [
                'Commodity trading is live on TradeAiGrow with curated watchlists for precious metals, energy, and agricultural contracts.',
                'Monitor spot and futures-style instruments, set price alerts, and diversify your portfolio beyond digital assets.',
                'Risk controls and margin summaries are displayed before every order confirmation.'
            ]
        },
        {
            id: 'ai-features',
            tag: 'AI',
            title: 'AI-powered insights across the platform',
            paragraphs: [
                'TradeAiGrow AI analyzes market trends, volatility, and cross-asset correlations to surface actionable signals on your dashboard.',
                'Smart summaries highlight opportunities in Spot, Forex, and Commodity modules while respecting your risk preferences.',
                'More AI-assisted tools—including portfolio rebalancing suggestions—will roll out throughout the summer.'
            ]
        }
    ];

    // for help and support
    showHelpSupportDialog = false;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private dashboardData: DashboardData,
        private languageService: LanguageService,
        private notificationService: Notification
    ) {}

    ngOnInit(): void {
        this.getUserName();
        this.selectedLang = this.languageService.current;
        this.loadNotifications();
    }

    getUserName() {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return;

            const parsed = JSON.parse(raw);
            const user = parsed?.data?.user ?? parsed;

            this.userName = user?.name ?? '';
            this.userEmail = user?.email ?? '';
            this.userUid = user?.id ?? '';
            this.balance = localStorage.getItem('balance') ?? '0.00';
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            this.userName = '';
            this.userEmail = '';
            this.userUid = '';
            this.balance = '0.00';
        }
    }

    openProfile(): void {
        this.showProfileDrawer = true;
        this.getVerificationHistory();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    openConfirmation() {
        this.displayConfirmation = true;
    }

    logOutConfirmation() {
        this.displayConfirmation = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('dashboardDatas');
        localStorage.removeItem('selectedRegion');
        localStorage.removeItem('tableData_crypto');
        localStorage.removeItem('tableData_forex');
        localStorage.removeItem('tableData_commodities');
        this.router.navigate(['/auth/login']);
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }

    onRegionChange(value: any): void {
        this.selectedRegion = value;
        localStorage.setItem('selectedRegion', value);
    }

    getVerificationHistory() {
        this.isLoading = true;
        if (!this.userEmail) {
            this.isLoading = false;
            return;
        }

        this.dashboardData.getVerificationHistory(this.userEmail).subscribe({
            next: (res: any) => {
                const list = res?.verificationHistory ?? res?.data ?? (Array.isArray(res) ? res : []);
                const latest: any = list[0];

                this.isIdentityVerified = latest?.isKycVerified === true;
                this.verificationStatus = this.normalizeStatus(latest?.status);
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Verification history failed:', err);
                this.isLoading = false;
            }
        });
    }

    private normalizeStatus(status: any): any {
        const s = (status ?? 'pending').toLowerCase();
        if (s === 'verified' || s === 'approved') return 'verified';
        if (s === 'rejected') return 'rejected';
        return 'pending';
    }

    verifyIdentity(verifyFileUpload: any) {
        const file: any = verifyFileUpload?.files?.[0];

        if (!this.documentType || !this.documentNumber || !file) {
            this.showDocError = !file;
            return;
        }
        this.isLoading = true;

        const payload: any = new FormData();
        payload.append('documentType', this.documentType);
        payload.append('documentNumber', this.documentNumber);
        payload.append('file', file);
        payload.append('email', this.userEmail);

        this.dashboardData.verifyIdentity(payload).subscribe({
            next: () => {
                this.isLoading = false;
                this.showVerifySuccessDialog = true;
                this.getVerificationHistory();
                this.closeVerifyDialog();
            },
            error: (err: any) => {
                console.error('Verification submit failed:', err);
                this.resetVerifyForm();
                this.verifyErrorMessage = err?.error?.message || 'Something went wrong. Please try again.';
                this.isLoading = false;
                this.showVerifyErrorDialog = true;
            }
        });
    }

    openVerifyDialog() {
        this.showVerifyDialog = true;
        this.resetVerifyForm();
    }

    closeVerifyDialog() {
        this.showVerifyDialog = false;
        this.resetVerifyForm();
    }

    resetVerifyForm() {
        this.documentType = null;
        this.documentNumber = '';
        this.showDocError = false;
        this.verifyFileUpload()?.clear();
    }

    closeVerifySuccessDialog(): void {
        this.showVerifySuccessDialog = false;
        this.resetVerifyForm();
    }

    closeVerifyErrorDialog(): void {
        this.showVerifyErrorDialog = false;
        this.verifyErrorMessage = '';
        this.resetVerifyForm();
    }

    changeLanguage(lang: any) {
        this.languageService.setLanguage(lang);
        this.selectedLang = lang;
    }

    openLanguageDialog(): void {
        this.showLanguageDialog = true;
    }

    selectLanguage(lang: any): void {
        this.changeLanguage(lang);
        this.showLanguageDialog = false;
    }

    openUpdatesDialog(): void {
        this.showUpdatesDialog = true;
    }

    openNotifications(): void {
        this.notificationFilter = 'all';
        this.showNotificationDrawer = true;
        this.loadNotifications();
    }

    setNotificationFilter(filter: any): void {
        this.notificationFilter = filter;
    }

    get filteredNotifications(): any[] {
        if (this.notificationFilter === 'unread') {
            return this.notifications.filter((n: any) => n.isRead !== true);
        }
        if (this.notificationFilter === 'read') {
            return this.notifications.filter((n: any) => n.isRead === true);
        }
        return this.notifications;
    }

    loadNotifications(): void {
        if (!this.userEmail) {
            this.notifications = [];
            this.refreshNotificationCounts();
            return;
        }

        this.isNotificationsLoading = true;
        this.notificationService.getNotifications({ email: this.userEmail }).subscribe({
            next: (res: any) => {
                this.notifications = (res?.data ?? []).map((n: any) => ({
                    id: n.id,
                    title: n.title,
                    message: n.message,
                    type: n.type || 'admin',
                    isRead: n.isRead === true,
                    createdAt: n.createdAt
                }));
                this.refreshNotificationCounts();
                this.isNotificationsLoading = false;
            },
            error: () => {
                this.notifications = [];
                this.refreshNotificationCounts();
                this.isNotificationsLoading = false;
            }
        });
    }

    private refreshNotificationCounts(): void {
        this.allNotificationCount = this.notifications.length;
        this.unreadNotificationCount = this.notifications.filter((n: any) => n.isRead !== true).length;
        this.readNotificationCount = this.notifications.filter((n: any) => n.isRead === true).length;
    }

    openNotificationDetail(item: any): void {
        this.selectedNotification = item;
        this.showNotificationDialog = true;
        this.markNotificationRead(item);
    }

    closeNotificationDialog(): void {
        this.showNotificationDialog = false;
        this.selectedNotification = null;
    }

    markNotificationRead(item: any): void {
        if (item?.isRead === true) return;
        item.isRead = true;
        this.refreshNotificationCounts();
        this.notificationService.markAsRead({ id: item.id }).subscribe({
            error: () => {
                item.isRead = false;
                this.refreshNotificationCounts();
            }
        });
    }

    markAllNotificationsRead(): void {
        if (!this.unreadNotificationCount) return;
        this.notifications.forEach((n: any) => (n.isRead = true));
        this.refreshNotificationCounts();
        this.notificationService.markAllAsRead({}).subscribe({
            error: () => this.loadNotifications()
        });
    }

    notificationIcon(type: any): any {
        switch (type) {
            case 'welcome':
                return 'pi pi-heart';
            case 'deposit':
                return 'pi pi-wallet';
            case 'withdraw':
                return 'pi pi-arrow-down';
            case 'admin':
                return 'pi pi-megaphone';
            default:
                return 'pi pi-bell';
        }
    }

    get languages(): any {
        return this.languageService.languages;
    }

    get currentLanguageLabel(): any {
        return this.languages.find((lang: any) => lang.value === this.selectedLang)?.label ?? 'English';
    }

    // for help and support
    openHelpSupportDialog(): void {
        this.showHelpSupportDialog = true;
    }
     openHelpCenter(): void {
        this.showHelpSupportDialog = false;
        this.showProfileDrawer = false;
        this.router.navigate(['/app/page/help-center']);
    }

    openPrivacyPolicy(): void {
        this.showHelpSupportDialog = false;
        this.showProfileDrawer = false;
        this.router.navigate(['/app/page/privacy-policy']);
    }

    openContactUs(): void {
        this.showHelpSupportDialog = false;
        this.showProfileDrawer = false;
        this.router.navigate(['/app/page/support']);
    }
}
