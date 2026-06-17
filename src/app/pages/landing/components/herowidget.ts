import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule, RouterModule],
    templateUrl:"./herowidget.html"
})
export class HeroWidget {
    constructor(private router: Router) {}
}
