import { AuthState, User, Courier, PharmacyState, GroupState, ConsumerState, DeliveryState } from '../../interfaces';

export * from './auth';
export * from './user';
export * from './courier';
export * from './pharmacy';
export * from './group';
export * from './consumer';
export * from './delivery';

export interface StoreStates {
  authStore: AuthState;
  userStore: User;
  courierStore: Courier;
  pharmacyStore: PharmacyState;
  groupStore: GroupState;
  consumerStore: ConsumerState;
  deliveryStore: DeliveryState;
}
