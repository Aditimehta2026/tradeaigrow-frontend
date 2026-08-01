import { Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { adminGuard } from '../../core/guards/admin.guard';

export default [
  { path: 'users', canActivate: [adminGuard], component: UserList, data: { breadcrumb: 'Users' } },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
] as Routes;
