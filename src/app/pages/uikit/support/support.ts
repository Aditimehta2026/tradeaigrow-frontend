import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  imports: [TranslatePipe,CommonModule, FormsModule, InputTextModule, ButtonModule, FluidModule, TextareaModule, ToastModule],
  templateUrl: './support.html',
  styleUrl: './support.scss',
  providers: [MessageService]
})
export class Support {
  fullName = '';
  email = '';
  message = '';

  constructor(private service: MessageService) { }
  isFormValid(): boolean {
    return this.fullName.trim() !== '' &&
      this.email.trim() !== '' &&
      this.message.trim() !== '';
  }
  showSuccessViaToast() {
    if (this.isFormValid()) {
      this.service.add({ severity: 'success', summary: 'Request Submitted', detail: `Your support request has been sent successfully. We'll get back to you shortly.` });
      // Reset form after submission
      this.fullName = '';
      this.email = '';
      this.message = '';
    }
  }
  openTelegram() {
    const telegramUsername = 'Signalswaps';
    const message = encodeURIComponent('Hello, I need support.');
    const url = `https://t.me/${telegramUsername}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

}
