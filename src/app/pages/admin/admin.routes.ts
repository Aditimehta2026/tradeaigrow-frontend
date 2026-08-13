import { Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminCreateDeposit } from './admin-create-deposit/admin-create-deposit';
import { SendNotification } from './send-notification/send-notification';

export default [
  { path: 'users', canActivate: [adminGuard], component: UserList, data: { breadcrumb: 'Users' } },
  { path: 'create-deposit', canActivate: [adminGuard], component: AdminCreateDeposit, data: { breadcrumb: 'Create Deposit' } },
  { path: 'send-notification', canActivate: [adminGuard], data: { breadcrumb: 'Send Notification' }, component: SendNotification },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
] as Routes;
