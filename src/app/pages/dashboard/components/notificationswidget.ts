import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule,TranslatePipe],
    templateUrl:"./notificationswidget.html",
    styleUrls: ['./notificationswidget.scss']
})
export class NotificationsWidget {

    quickLinks = [
        {
            labelKey: 'Deposit',
            descKey: 'quickLinks.depositDesc',
            icon: 'pi-arrow-down',
            action: () => this.router.navigate(['/app/page/deposit']),
            iconBg: 'bg-pink-500/15 text-pink-600 dark:text-pink-300',
            topBar: 'bg-gradient-to-r from-pink-400 to-pink-600',
            rippleClass: 'quick-link-deposit',
        },
        {
            labelKey: 'Withdraw',
            descKey: 'quickLinks.withdrawDesc',
            icon: 'pi-arrow-up',
            action: () => this.router.navigate(['/app/page/withdraw']),
            iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
            topBar: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
            rippleClass: 'quick-link-withdraw',
        },
        {
            labelKey: 'Support',
            descKey: 'quickLinks.supportDesc',
            icon: 'pi-question-circle',
            action: () => this.router.navigate(['/app/page/support']),
            iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
            topBar: 'bg-gradient-to-r from-blue-400 to-blue-600',
            rippleClass: 'quick-link-support',
        },
        {
            labelKey: 'Events',
            descKey: 'quickLinks.eventsDesc',
            icon: 'pi-calendar',
            action: () => this.router.navigate(['/app/page/upcoming-events']),
            iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
            topBar: 'bg-gradient-to-r from-violet-400 to-violet-600',
            rippleClass: 'quick-link-events',
        },
    ];
    constructor(public router: Router) {}
}
