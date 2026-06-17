import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface TradeInfo {
    title: string;
    body: string;
}

@Component({
    selector: 'footer-widget',
    imports: [RouterModule, DialogModule, ButtonModule],
    templateUrl: './footerwidget.html'
})
export class FooterWidget {
    showDialog = false;
    selectedInfo: TradeInfo | null = null;

    private infoMap: Record<string, TradeInfo> = {
        spot: {
            title: 'Spot Trading',
            body: 'Spot trading runs on live market data. As prices move up or down within short time windows, you can capture profits from those movements. Returns are percentage-based and tied to short-duration trades — ideal for quick, active trading on real-time prices.'
        },
        ai: {
            title: 'AI Trading',
            body: 'Our AI analyzes the markets and trades on your behalf. AI plans run over a fixed period — typically 5 to 120 days — steadily working toward your target returns while you stay completely hands-off. Choose a duration that fits your goals and let the AI do the work.'
        },
        commodity: {
            title: 'Commodity Trading',
            body: 'Trade commodities such as gold and oil. Profits are percentage-based and depend on price movements over your chosen time period. A great way to diversify beyond crypto and benefit from global commodity trends.'
        },
        events: {
            title: 'Upcoming Events',
            body: 'Seasonal and festival periods — like Christmas and other holidays — often create strong market opportunities. Based on how actively you trade, we highlight upcoming events where conditions may be especially favorable to grow your profits.'
        }
    };

    constructor(public router: Router) {}

    openInfo(key: string): void {
        this.selectedInfo = this.infoMap[key] ?? null;
        this.showDialog = true;
    }

    scrollToSection(event: Event, sectionId: string): void {
        event.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    handleAnchorClick(event: Event): void {
        const target = event.target as HTMLAnchorElement;
        if (target && target.hash) {
            const sectionId = target.hash.substring(1);
            if (sectionId) {
                this.scrollToSection(event, sectionId);
            }
        }
    }
}