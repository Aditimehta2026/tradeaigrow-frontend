import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  imports: [CommonModule, ButtonModule, TranslatePipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss'
})
export class PrivacyPolicy {
  readonly lastUpdated = 'August 26, 2026';

  constructor(private router: Router) {}

  readonly sections: any[] = [
    {
      title: 'Who we are',
      body: 'TradeAIGrow (“we”, “us”) provides an AI-assisted trading platform for spot, forex, commodity, and related services. This policy explains how we handle personal information when you use the TradeAIGrow website and app.'
    },
    {
      title: 'Information we collect',
      body: 'We collect account details you provide (name, email, password), identity verification documents and document numbers, deposit and withdrawal records, wallet addresses, trading activity, region preference, language, and device or log data needed to keep the service secure.'
    },
    {
      title: 'How we use information',
      body: 'We use this information to create and secure your account, process deposits and withdrawals, complete identity checks, operate trading features, send in-app notifications, provide customer support, prevent fraud, and meet legal or regulatory requirements.'
    },
    {
      title: 'How we share information',
      body: 'We do not sell your personal information. We may share it with identity-verification and payment or blockchain network providers, cloud and infrastructure vendors, and with authorities when required by law. Access inside TradeAIGrow is limited to staff who need it to operate the platform.'
    },
    {
      title: 'Security and retention',
      body: 'We use encryption in transit, access controls, and account authentication to protect your data. We keep account, transaction, and verification records for as long as your account is active and as required for compliance, dispute handling, and security.'
    },
    {
      title: 'Your choices',
      body: 'You can update profile details, language, and region in My Account. You may request access, correction, or deletion of personal data, subject to legal retention rules for trading and verification records. Contact us if you want to exercise these rights.'
    }
  ];

  goToContactUs(): void {
    this.router.navigate(['/app/page/support']);
  }
}
