import { AuthState, User, Courier } from '../../interfaces';

export * from './auth';
export * from './user';
export * from './courier';

export interface StoreStates {
  authStore: AuthState;
  userStore: User;
  courierStore: Courier;
}
