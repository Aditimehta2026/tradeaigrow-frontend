import { Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminCreateDeposit } from './admin-create-deposit/admin-create-deposit';

export default [
  { path: 'users', canActivate: [adminGuard], component: UserList, data: { breadcrumb: 'Users' } },
  { path: 'create-deposit', canActivate: [adminGuard], component: AdminCreateDeposit, data: { breadcrumb: 'Create Deposit' } },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
] as Routes;
