import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'pricing-widget',
    imports: [DividerModule, ButtonModule, RippleModule, RouterModule],
    templateUrl: './pricingwidget.html'
   
})
export class PricingWidget {
    constructor(private router: Router) {}
}
