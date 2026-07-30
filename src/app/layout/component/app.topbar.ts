import { Component, viewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DashboardData } from '@/pages/service/dashboard-data';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUpload } from 'primeng/fileupload';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@/core/services/language.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ConfirmDialogModule, DialogModule, ButtonModule,
        MenubarModule, IconFieldModule, InputIconModule,
        MenuModule, DrawerModule, DividerModule, FormsModule, SelectButtonModule, SelectModule, FileUploadModule, InputTextModule,
        ProgressSpinnerModule,FileUpload,TranslatePipe
    ],
    templateUrl: './app.topbar.html',
    styleUrl: './app.topbar.scss',
    providers: [ConfirmationService]
})
export class AppTopbar {
    verifyFileUpload = viewChild<FileUpload>('verifyFileUpload');
    items!: MenuItem[];
    displayConfirmation: boolean = false;
    userName: string = '';

    balance: string = '0.00';
    userEmail: string = '';
    userUid: string = '';
    profileItems: MenuItem[] = [];
    showProfileDrawer: boolean = false;
    selectedRegion: 'UK' | 'US' = 'UK';
    regionOptions = [
        { label: 'UK', value: 'UK' },
        { label: 'US', value: 'US' }
    ];

    // Identity Verification
    isIdentityVerified: boolean = false;
    showVerifyDialog: boolean = false;
    // form fields
    documentType: 'passport' | 'driver_license' | 'national_id' | 'other' | null = null;
    documentNumber: string = '';
    documentTypeOptions = [
        { label: 'Passport', value: 'passport' },
        { label: 'Driver License', value: 'driver_license' },
        { label: 'National ID', value: 'national_id' },
        { label: 'Other', value: 'other' }
    ];
    showDocError: boolean = false;
    verificationStatus: 'pending' | 'verified' | 'rejected' = 'pending';
    showVerifySuccessDialog: boolean = false;

    isLoading: boolean = false;
    // error for too many request
    showVerifyErrorDialog: boolean = false;
    verifyErrorMessage: string = '';
    selectedLang = 'en';
    showLanguageDialog = false;
    showUpdatesDialog = false;

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


    constructor(public layoutService: LayoutService,
        public confirmationService: ConfirmationService, public router: Router, public dashboardData: DashboardData,public languageService: LanguageService) { }
    ngOnInit(): void {
        this.getUserName();
        this.buildProfileMenu();
        this.selectedLang = this.languageService.current;
    }

    getUserName() {
        try {
            const raw = localStorage.getItem('user');
            if (!raw) return;

            const parsed = JSON.parse(raw);
            const user = parsed?.data?.user ?? parsed;

            this.userName = user?.name ?? '';
            this.userEmail = user?.email ?? '';
            this.userUid = user?.uid ?? user?._id ?? user?.id ?? '';
            this.balance = localStorage.getItem('balance') ?? '0.00';
            console.log(this.userName,this.balance);
            
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

    closeProfile(): void {
        this.showProfileDrawer = false;
    }


    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    openConfirmation() {
        this.displayConfirmation = true;
        this.confirmationService.confirm({
            message: 'Are you sure you want to logout?',
            header: 'Logout Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                // User clicked Yes - proceed with logout
                this.logOutConfirmation();
            },
            reject: () => {
                // User clicked No - just close
            }
        });
    }

    logOutConfirmation() {
        this.displayConfirmation = false;
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('dashboardDatas');
        localStorage.removeItem('selectedRegion');
        // Navigate to login
        this.router.navigate(['/auth/login']);
    }
    closeConfirmation() {
        this.displayConfirmation = false;
    }

    buildProfileMenu(): void {
        this.profileItems = [
            {
                label: 'Profile',
                icon: 'pi pi-user',
                items: [
                    {
                        label: `User: ${this.userName}`,
                        icon: 'pi pi-id-card',
                        disabled: true
                    },
                    {
                        label: `Balance: $${this.balance}`,
                        icon: 'pi pi-wallet',
                        disabled: true
                    },
                    { separator: true },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => this.openConfirmation()
                    }
                ]
            }
        ];
    }
    onRegionChange(value: 'UK' | 'US'): void {
        this.selectedRegion = value;
        localStorage.setItem('selectedRegion', value);
    }

    getVerificationHistory() {
        this.isLoading= true;
        if (!this.userEmail) return;

        this.dashboardData.getVerificationHistory(this.userEmail).subscribe({
            next: (res) => {
                const list = res?.verificationHistory ?? res?.data ?? (Array.isArray(res) ? res : []);
                const latest = list[0];

                this.isIdentityVerified = latest?.isKycVerified === true;
                this.verificationStatus = this.normalizeStatus(latest?.status);
                this.isLoading= false;
            },
            error: (err) => {
                console.error('Verification history failed:', err);
                this.isLoading= false;
            }
        });
    }

    private normalizeStatus(status?: string): 'pending' | 'verified' | 'rejected' {
        const s = (status ?? 'pending').toLowerCase();
        if (s === 'verified' || s === 'approved') return 'verified';
        if (s === 'rejected') return 'rejected';
        return 'pending';
    }

    verifyIdentity(verifyFileUpload: any) {
        const file = verifyFileUpload?.files?.[0] as File;

        if (!this.documentType || !this.documentNumber || !file) {
            this.showDocError = !file;
            return;
        }
        this.isLoading= true;

        const payload = new FormData();
        payload.append('documentType', this.documentType);
        payload.append('documentNumber', this.documentNumber);
        payload.append('file', file);
        payload.append('email', this.userEmail);

        this.dashboardData.verifyIdentity(payload).subscribe({
            next: () => {
                this.isLoading=false;
                this.showVerifySuccessDialog=true;
                this.getVerificationHistory();
                this.closeVerifyDialog();
                
            },
            error: (err) => {
                console.error('Verification submit failed:', err);
                this.resetVerifyForm();
                 this.verifyErrorMessage = err.error.message || 'Something went wrong. Please try again.';
                 this.isLoading=false;
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
    changeLanguage(lang: string) {
        this.languageService.setLanguage(lang);
        this.selectedLang = lang;
    }

    openLanguageDialog(): void {
        this.showLanguageDialog = true;
    }

    closeLanguageDialog(): void {
        this.showLanguageDialog = false;
    }

    selectLanguage(lang: string): void {
        this.changeLanguage(lang);
        this.closeLanguageDialog();
    }

    openUpdatesDialog(): void {
        this.showUpdatesDialog = true;
    }

    closeUpdatesDialog(): void {
        this.showUpdatesDialog = false;
    }
    get languages() {
        return this.languageService.languages;
      }
    
      get currentLanguageLabel(): string {
        return this.languages.find((lang) => lang.value === this.selectedLang)?.label ?? 'English';
    }


}
