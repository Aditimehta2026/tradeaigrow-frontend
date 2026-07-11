import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule , RouterModule,TranslatePipe],
    templateUrl:"./notificationswidget.html",
    styleUrls: ['./recentsaleswidget.scss']
})
export class NotificationsWidget {
    constructor(public router: Router) {}
    goToSupport(){
        this.router.navigate(['/app/page/support']);
    }
    goToDeposit(){
        this.router.navigate(['/app/page/deposit']);
    }
    goToEvents(){
        this.router.navigate(['/app/page/events']);
    }
    goToWithdraw(){
        this.router.navigate(['/app/page/withdraw']);
    }
}
