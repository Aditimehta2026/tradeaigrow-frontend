import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { TranslatePipe } from '@ngx-translate/core';
import { Authservice } from '../../pages/auth/service/authservice';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ButtonModule, AvatarModule,TranslatePipe],
    templateUrl: './app.menu.html',
})
export class AppMenu {
    model: MenuItem[] = [];

    userName = '';
    userEmail = '';
    userInitial = 'U';
    constructor(private layoutService: LayoutService,private authService: Authservice) { }

    ngOnInit() {
        this.initMenu();
        this.loadUser();
    }
    initMenu() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app/dashboard'] }]
            },
            {
                label: 'Trading',
                items: [
                    { label: 'Deposit', icon: 'pi pi-fw pi-wallet', routerLink: ['/app/page/deposit'] },
                    { label: 'Withdraw', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/app/page/withdraw'] },
                    { label: 'Withdrawal History', icon: 'pi pi-fw pi-history', routerLink: ['/app/page/withdrawal-history'] },
                    { label: 'Spot Trade', icon: 'pi pi-fw pi-bitcoin', routerLink: ['/app/page/spot-trade'] },
                    { label: 'Forex Trade', icon: 'pi pi-fw pi-dollar', routerLink: ['/app/page/forex-trade'] },
                    { label: 'Events', icon: 'pi pi-fw pi-calendar', routerLink: ['/app/page/upcoming-events'] },
                    { label: 'Loan', icon: 'pi pi-fw pi-money-bill', routerLink: ['/app/page/loan'] },
                    { label: 'Support', icon: 'pi pi-fw pi-check-square', routerLink: ['/app/page/support'] }
                ]
            },
            {
                label: 'AI Trading',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Start AI Trading',      // Sub-menu label
                        icon: 'pi pi-fw pi-play',     // Icon to indicate starting action
                        items: [
                            {
                                label: 'Trade Here',       // Final action
                                icon: 'pi pi-fw pi-chart-line',
                                routerLink: ['/app/page/ai-trading']
                            }

                        ]
                    }
                ]
            },
            {
                label: 'MultiAsset Trade',
                icon: 'pi pi-fw pi-globe', // Good for multi-market assets like oil, metals, commodities
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Start Commodity Trading',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'Commodity Trading',
                                icon: 'pi pi-fw pi-chart-line',
                                routerLink: ['/app/page/commodity-trading']
                            }
                        ]
                    }
                ]
            }
        ];

        if (this.authService.isAdmin()) {
            this.model.push({
                label: 'Admin',
                items: [
                    { label: 'User List', icon: 'pi pi-fw pi-users', routerLink: ['/app/admin/users'] }
                ]
            });
        }
    }
    closeMenu() {
        this.layoutService.layoutState.update((prev) => ({
            ...prev,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        }));
    }
    loadUser() {
        try {
            const parsed = JSON.parse(localStorage.getItem('user') || '{}');
            const user = parsed?.data?.user ?? parsed;
            this.userName = user?.username || user?.name || 'User';
            this.userEmail = user?.email || '';
            this.userInitial = this.userName.charAt(0).toUpperCase();
        } catch {
            this.userName = 'User';
            this.userEmail = '';
            this.userInitial = 'U';
        }
    }
}
