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

            this.userName = user?.username ?? '';
            this.userEmail = user?.email ?? '';
            this.userUid = user?.uid ?? user?._id ?? user?.id ?? '';
            this.balance = user?.balance != null ? String(user.balance) : '0.00';
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
    get languages() {
        return this.languageService.languages;
      }


}
