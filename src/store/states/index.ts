import {
  AuthState,
  ConsumerState,
  Courier,
  DeliveryState,
  GroupState,
  PharmacyState,
  SettingState,
  TransactionState,
  BillingState,
  User,
  TeamsState
} from '../../interfaces';

export * from './auth';
export * from './user';
export * from './courier';
export * from './pharmacy';
export * from './group';
export * from './billingAccountStore';
export * from './consumer';
export * from './delivery';
export * from './teams';
export * from './transaction';
export * from './setting';

export interface StoreStates {
  authStore: AuthState;
  userStore: User;
  courierStore: Courier;
  pharmacyStore: PharmacyState;
  groupStore: GroupState;
  teamsStore: TeamsState;
  billingAccountStore: BillingState;
  consumerStore: ConsumerState;
  deliveryStore: DeliveryState;
  transactionStore: TransactionState;
  settingStore: SettingState;
}
