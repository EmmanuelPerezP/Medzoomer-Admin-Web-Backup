import {
  AuthState,
  ConsumerState,
  Courier,
  DeliveryState,
  GroupState,
  PharmacyState,
  SystemSettings,
  TransactionState,
  TransactionsState,
  BillingState,
  User,
  TeamsState,
  SettingsGPState,
  TimezoneState
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
export * from './systemSettings';
export * from './transactions';
export * from './settingsGP';
export * from './timezones';

export interface StoreStates {
  authStore: AuthState;
  userStore: User;
  courierStore: Courier;
  pharmacyStore: PharmacyState;
  groupStore: GroupState;
  teamsStore: TeamsState;
  settingGPStore: SettingsGPState;
  billingAccountStore: BillingState;
  consumerStore: ConsumerState;
  deliveryStore: DeliveryState;
  transactionsStore: TransactionsState;
  transactionStore: TransactionState;
  settingStore: SystemSettings;
  timezoneStore: TimezoneState;
}
