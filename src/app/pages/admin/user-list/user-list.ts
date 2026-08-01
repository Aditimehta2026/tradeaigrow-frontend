import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslatePipe } from '@ngx-translate/core';
import { Admin } from '../../service/admin';

@Component({
  selector: 'app-user-list',
    imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    ProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})

export class UserList implements OnInit {
  users: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchQuery = '';

  showEditDialog = false;
  showDeleteDialog = false;
  selectedUser: any = null;
  editUser: any = {};

  roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
  ];

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load users.';
        this.isLoading = false;
      }
    });
  }

  onEdit(user: any): void {
    this.selectedUser = user;
    this.editUser = { ...user };
    this.showEditDialog = true;
  }

  saveUser(): void {
    // TODO: connect update API
    this.showEditDialog = false;
    this.selectedUser = null;
  }

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.selectedUser = null;
  }

  onDelete(user: any): void {
    this.selectedUser = user;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    // TODO: connect delete API
    this.showDeleteDialog = false;
    this.selectedUser = null;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.selectedUser = null;
  }

  getRoleSeverity(role?: string): 'success' | 'warn' | 'secondary' {
    return role === 'admin' ? 'warn' : 'secondary';
  }

  getVerifiedSeverity(isVerified?: boolean): 'success' | 'danger' {
    return isVerified ? 'success' : 'danger';
  }

  get filteredUsers(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.users;
    }

    return this.users.filter((user) => {
      const email = (user.email || '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      return email.includes(query) || username.includes(query);
    });
  }
}
