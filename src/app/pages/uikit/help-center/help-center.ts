import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-help-center',
  imports: [CommonModule, ButtonModule, TranslatePipe],
  templateUrl: './help-center.html',
  styleUrl: './help-center.scss'
})
export class HelpCenter {
  openFaqId: any = 'verify';

  constructor(private router: Router) {}

  readonly faqs: any[] = [
    {
      id: 'verify',
      question: 'How do I verify my identity?',
      answer: 'Open My Account, go to Verification Center, then upload a valid government-issued ID. Deposits and withdrawals stay locked until verification is approved.'
    },
    {
      id: 'deposit',
      question: 'How do I deposit funds?',
      answer: 'Go to Deposit from the menu, choose your coin and network, then send funds to the displayed wallet address. Always copy the address carefully and match the network.'
    },
    {
      id: 'withdraw',
      question: 'How do I withdraw funds?',
      answer: 'Go to Withdraw, enter a matching wallet address and network, then confirm with your account password. Double-check the address — transfers to the wrong network cannot be reversed.'
    },
    {
      id: 'timing',
      question: 'How long do deposits and withdrawals take?',
      answer: 'Network confirmations usually complete within minutes. Withdrawal requests are reviewed by our team and typically processed within 12–24 hours.'
    },
    {
      id: 'language',
      question: 'How do I change the language?',
      answer: 'Open My Account, tap Language, then select your preferred language. The app updates immediately.'
    },
    {
      id: 'contact',
      question: 'How do I contact support?',
      answer: 'Use Contact Us to message us on Telegram or submit a support request. We respond within 12–24 hours.'
    }
  ];

  toggleFaq(id: any): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }

  goToContactUs(): void {
    this.router.navigate(['/app/page/support']);
  }
}
