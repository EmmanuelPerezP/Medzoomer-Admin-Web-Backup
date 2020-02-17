import { AuthState, User, Courier, PharmacyState } from '../../interfaces';

export * from './auth';
export * from './user';
export * from './courier';
export * from './pharmacy';

export interface StoreStates {
  authStore: AuthState;
  userStore: User;
  courierStore: Courier;
  pharmacyStore: PharmacyState;
}
