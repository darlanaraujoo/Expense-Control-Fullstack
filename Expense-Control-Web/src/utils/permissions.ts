import { ROOT_ADMIN_EMAIL } from '../constants/auth';
import type { AuthUser } from '../types';

export function isRootAdmin(email?: string): boolean {
  return email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
}

export function canManageRecord(ownerUserId: number, authUser: AuthUser | null): boolean {
  if (!authUser) return false;
  if (isRootAdmin(authUser.email)) return true;
  return authUser.id === ownerUserId;
}
