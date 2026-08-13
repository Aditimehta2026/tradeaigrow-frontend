import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '@ngx-translate/core';
import { Admin } from '@/pages/service/admin';

@Component({
  selector: 'app-send-notification',
   imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    FluidModule,
    ProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './send-notification.html',
  styleUrl: './send-notification.scss',
  providers: [MessageService]
})
export class SendNotification implements OnInit {
  isLoading = false;
  isSubmitting = false;
  userEmails: string[] = [];

  form = {
    email: '',
    title: '',
    message: ''
  };

  constructor(
    private adminService: Admin,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get isFormValid(): boolean {
    return !!(
      this.form.email?.trim() &&
      this.form.title?.trim() &&
      this.form.message?.trim()
    );
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.userEmails = (res.data ?? []).map((u: any) => u.email).filter(Boolean);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.'
        });
      }
    });
  }

  submit(): void {
    if (!this.isFormValid || this.isSubmitting) return;

    this.isSubmitting = true;
    const payload: any = {
      email: this.form.email.trim(),
      title: this.form.title.trim(),
      message: this.form.message.trim(),
      type: 'admin'
    };

    this.adminService.sendNotification(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Notification sent successfully.'
        });
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send notification.'
        });
      }
    });
  }

  resetForm(): void {
    this.form = {
      email: '',
      title: '',
      message: ''
    };
  }
}
