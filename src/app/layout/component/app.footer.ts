import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterModule],
    template: `<div class="layout-footer px-4 py-3 text-center">
        <div class="text-xs sm:text-sm md:text-base">
            Built with precision by
            <span class="text-primary font-bold mx-1">TradeAIGrow</span>
            — Smart AI Trading Platform
        </div>
    </div>`
})
export class AppFooter {}