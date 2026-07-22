import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { TranslatePipe } from '@ngx-translate/core';

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
    constructor(private layoutService: LayoutService) { }

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
                    // { label: 'Deposit History', icon: 'pi pi-fw pi-history', routerLink: ['/app/page/deposit-history'] },
                    { label: 'Withdraw', icon: 'pi pi-fw pi-arrow-down', routerLink: ['/app/page/withdraw'] },
                    { label: 'Withdrawal History', icon: 'pi pi-fw pi-history', routerLink: ['/app/page/withdrawal-history'] },
                    { label: 'Spot Trade', icon: 'pi pi-fw pi-bitcoin', routerLink: ['/app/page/spot-trade'] },
                    { label: 'Trade History', icon: 'pi pi-fw pi-history', routerLink: ['/app/page/spot-trade-history'] },
                    { label: 'Forex Trade', icon: 'pi pi-fw pi-dollar', routerLink: ['/app/page/forex-trade'] },
                    { label: 'Events', icon: 'pi pi-fw pi-calendar', routerLink: ['/app/page/upcoming-events'] },
                    // { label: 'AI Trading', icon: 'pi pi-fw pi-chart-line', routerLink: ['/app/page/ai-trading'] },
                    { label: 'Loan', icon: 'pi pi-fw pi-money-bill', routerLink: ['/app/page/loan'] },
                    { label: 'Support', icon: 'pi pi-fw pi-check-square', routerLink: ['/app/page/support'] },
                    // { label: 'Market', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/app/page/market'] },

                    // { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/app/page/media'] },
                    // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    // { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    // { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    // { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'AI Trading',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Start AI Trade',      // Sub-menu label
                        icon: 'pi pi-fw pi-play',     // Icon to indicate starting action
                        items: [
                            {
                                label: 'Trade Here',       // Final action
                                icon: 'pi pi-fw pi-chart-line',
                                routerLink: ['/app/page/ai-trading']
                            },
                            {
                                label: 'Trade History',    // Sub-menu for history
                                icon: 'pi pi-fw pi-clock',
                                routerLink: ['/app/page/ai-trade-history']
                            },
                            // {
                            //     label: 'Login',
                            //     icon: 'pi pi-fw pi-sign-in',
                            //     routerLink: ['/auth/login']
                            // },
                            // {
                            //     label: 'Error',
                            //     icon: 'pi pi-fw pi-times-circle',
                            //     routerLink: ['/auth/error']
                            // },
                            // {
                            //     label: 'Access Denied',
                            //     icon: 'pi pi-fw pi-lock',
                            //     routerLink: ['/auth/access']
                            // }

                        ]
                    },
                    // {
                    //     label: 'Landing',
                    //     icon: 'pi pi-fw pi-globe',
                    //     routerLink: ['/landing']
                    // },

                    // {
                    //     label: 'Crud',
                    //     icon: 'pi pi-fw pi-pencil',
                    //     routerLink: ['/pages/crud']
                    // },
                    // {
                    //     label: 'Not Found',
                    //     icon: 'pi pi-fw pi-exclamation-circle',
                    //     routerLink: ['/pages/notfound']
                    // },
                    // {
                    //     label: 'Empty',
                    //     icon: 'pi pi-fw pi-circle-off',
                    //     routerLink: ['/pages/empty']
                    // }
                ]
            },
            {
                label: 'MultiAsset Trade',
                icon: 'pi pi-fw pi-globe', // Good for multi-market assets like oil, metals, commodities
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Start MultiAsset Trade',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'Commodity Trading',
                                icon: 'pi pi-fw pi-chart-line',
                                routerLink: ['/app/page/commodity-trading']
                            },
                            {
                                label: 'Trade History',
                                icon: 'pi pi-fw pi-clock',
                                routerLink: ['/app/page/multiasset-trade-history']
                            }
                        ]
                    }
                ]
            }
            // ,{
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // }
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             // url: 'https://github.com/primefaces/sakai-ng',
            //             // target: '_blank'
            //             routerLink: ['/']
            //         }
            //     ]
            // }
        ];
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
