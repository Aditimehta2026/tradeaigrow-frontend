import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import {AppFloatingConfigurator} from "@/layout/component/app.floatingconfigurator";

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './topbarwidget.component.html'
})
export class TopbarWidget {
    constructor(public router: Router) {}

    scrollToSection(sectionId: string): void {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
