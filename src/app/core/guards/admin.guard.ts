import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '@/pages/auth/service/authservice';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/app/dashboard']);
  return false;
};
