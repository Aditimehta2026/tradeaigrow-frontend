import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { CookieConsent } from '@/pages/service/cookie/cookie-consent';

@Component({
  selector: 'app-cookie-consent-dialog',
  imports: [ ButtonModule, DrawerModule, CommonModule],
  templateUrl: './cookie-consent-dialog.html',
  styleUrl: './cookie-consent-dialog.scss'
})
export class CookieConsentDialog {
  // for dialog
  visible: boolean = true;
  // for drawer
  visibleDrawer: boolean = false;
  drawerType: 'policy' | 'customize' | '' = '';

  constructor(private cookieService: CookieConsent) { }

  ngOnInit() {
    this.checkConsent();
  }

  checkConsent() {
    const consent = localStorage.getItem('cookieConsent');

    if (consent == 'accepted' || consent == 'rejected') {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  // Open drawer
  openDrawer(type: 'policy' | 'customize') {
    this.drawerType = type;
    this.visibleDrawer = true;
  }

  // Accept
  accept() {
    localStorage.setItem('cookieConsent', 'accepted');
    this.cookieService.sendConsent().subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.visible = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.visible = false;
      }
    });
  }

  // Reject
  reject() {
    localStorage.setItem('cookieConsent', 'rejected');
    this.visible = false;
  }

  // Close icon
  onClose() {
    this.visible = false;
  }
}
