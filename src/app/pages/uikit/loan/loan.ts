import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Component, ViewChild } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUpload } from 'primeng/fileupload';
import { DashboardData } from '../../service/dashboard-data';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loan',
  imports: [TranslatePipe,CommonModule, BreadcrumbModule, MenuModule, ButtonModule, ToastModule, FileUploadModule, FormsModule, InputNumberModule, SelectModule, DialogModule],
  templateUrl: './loan.html',
  styleUrl: './loan.scss',
  providers: [MessageService]
})
export class Loan {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  loanAmount: number | null = null;
  selectedLoanTerm: number | null = null;
  calculatedInterest: number = 0;
  dailyInterestRate: number = 0.33;
  isFormDisabled: boolean = true; 
  loanAmountExceedsMax: boolean = false;
  showIdDocumentError: boolean = false;
  showSuccessDialog: boolean = false;
  loanlimitDialog: boolean = false;
  loanErrorDetails: string = '';

  uploadedFiles: any[] = [];
  userBalance: number = 0;
  maxLimit = 0;
  loanTermOptions = [
      { label: '7 Days', value: 7 },
      { label: '15 Days', value: 15 },
      { label: '30 Days', value: 30 },
      { label: '45 Days', value: 45 },
      { label: '60 Days', value: 60 }
  ];

  constructor(
      private messageService: MessageService, 
      private dashboardData: DashboardData,
      private router:Router
  ) {}

  ngOnInit(): void {
      this.getUserData();
  }

  calculateInterest() {
      if (this.loanAmount && this.selectedLoanTerm) {
          this.calculatedInterest = (this.loanAmount * this.dailyInterestRate / 100) * this.selectedLoanTerm;
      } else {
          this.calculatedInterest = 0;
      }
  }

  isFormValid(): boolean {
      if (this.userBalance < 1000) {
          return false;
      }
      
      // Check if file is selected
      const hasFile = this.fileUpload && 
                     this.fileUpload.files && 
                     this.fileUpload.files.length > 0;
      
      if (!hasFile) {
          this.showIdDocumentError = true;
      } else {
          this.showIdDocumentError = false;
      }
      
      return this.loanAmount !== null && 
         this.loanAmount >= 100 && 
         this.loanAmount <= this.maxLimit &&
         !this.loanAmountExceedsMax &&
         this.selectedLoanTerm !== null &&
         hasFile; // File is mandatory
  }

  submitLoanApplication() {
      if (!this.isFormValid()) {
          // Show validation errors
          if (!this.fileUpload || !this.fileUpload.files || this.fileUpload.files.length === 0) {
              this.showIdDocumentError = true;
              this.messageService.add({ 
                  severity: 'warn', 
                  summary: 'Validation Error', 
                  detail: 'Please fill all required fields including ID Document.' 
              });
          }
          return;
      }

      // Get user email
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user || '{}');
      const userEmail = userData.data?.user?.email;
      

      // Create FormData with file and all JSON fields
      const formData = new FormData();
      
      // Append file (mandatory)
      const file = this.fileUpload.files[0] as File;
      formData.append('file', file);
      
      // Append all JSON fields (all mandatory)
      formData.append('email', userEmail);
      formData.append('loanAmount', this.loanAmount!.toString());
      formData.append('loanTerm', this.selectedLoanTerm!.toString());
      formData.append('calculatedInterest', this.calculatedInterest.toString());


      // Single API call with FormData containing file + JSON fields
      this.dashboardData.submitLoanApplication(formData).subscribe({
          next: (res) => {
              console.log("Loan application submitted:", res);
               this.showSuccessDialog = true;
              // Reset form
              this.resetForm();
          },
          error: (err) => {
              this.resetForm();
              this.loanErrorDetails = err.error.message || `Today's loan application limit has been reached. Please try again tomorrow.`;
              this.loanlimitDialog = true;
          }
      });
  }

  resetForm() {
      this.loanAmount = null;
      this.selectedLoanTerm = null;
      this.calculatedInterest = 0;
      this.showIdDocumentError = false;
      if (this.fileUpload) {
          this.fileUpload.clear();
      }
  }

  getUserData() {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user || '{}');
      const userEmail = userData.data?.user?.email;
      
      this.dashboardData.getUserData(userEmail).subscribe({
          next: (res) => {
              console.log("user data", res);
              this.userBalance = 10000;
              this.isFormDisabled=false;
              this.maxLoanAmount(this.userBalance);
              this.updateFormAccess();
          },
          error: (err) => {
              console.warn('API error:', err);
          }
      });
  }

  maxLoanAmount(userBalance: number) {
      this.maxLimit = userBalance * 2;
      console.log("max limit", this.maxLimit);
      return this.maxLimit;
  }

  updateFormAccess() {
      this.isFormDisabled = this.userBalance < 1000;
  }

  onLoanAmountInput(event: any) {
      if (this.loanAmount !== null && this.loanAmount !== undefined) {
          if (this.loanAmount > this.maxLimit) {
              this.loanAmountExceedsMax = true;
          } else if (this.loanAmount < 100) {
              this.loanAmountExceedsMax = false;
          } else {
              this.loanAmountExceedsMax = false;
          }
      } else {
          this.loanAmountExceedsMax = false;
      }
      this.calculateInterest();
  }

  onMoveToSupport() {
      this.dismissLoanPopups();
      this.router.navigate(['/app/page/support']);
  }

  closeDialog() {
      this.dismissLoanPopups();
  }

    dismissLoanPopups(){
      this.showSuccessDialog = false;
      this.loanlimitDialog = false;
      this.loanErrorDetails='';
      this.resetForm()
  }
}
