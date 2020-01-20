import { AuthState } from './auth';
import { User } from './user';
import { Test } from './test';

export * from './auth';
export * from './user';
export * from './test';

export interface StoreStates {
  auth: AuthState;
  user: User;
  test: Test;
}
