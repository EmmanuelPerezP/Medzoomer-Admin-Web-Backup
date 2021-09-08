import { BillingAccount } from './billingAccounts';
import { Filters } from './helpers';

export interface SettingsGP {
  name: string;
  invoiceFrequency: string;
  isManualBatchDeliveries: string;
  autoDispatchTimeframe: string;
  dispatchedBeforeClosingHours: string;
  maxDeliveryLegDistance: string;
  invoiceFrequencyInfo: number;
  reporting: string;
  pickUpTimes: IPickUpOptions;
  invoicedId?: number | null;
  billingAccountHolder: BillingAccount;
  amountOrdersInBatch: number;
  billingAccount: string;
  calculateDistanceForSegments: string;
  forcedPrice: number | null;
  prices: SettingsGPPrice[];
  allowHighVolumeDeliveries: boolean;
  enablePriceProjection: boolean;
  highVolumePrices: SettingsGPPrice[];
  standardPrices: SettingsGPPrice[];
  courierPricing: ICourierPricing;
  failedDeliveryCharge: string | null;
  isDefault: boolean;
  keys: IAPIKeys;
}

export interface IAPIKeys {
  publicKey: string,
  secretKey: string
}
export interface SettingsGPPrice {
  orderCount: string;
  prices: InSettingsGPPricePrice[];
}

export interface ICourierPricing {
  courier_cost_for_one_order: string,
  courier_cost_for_two_order: string,
  courier_cost_for_more_two_order: string,
  courier_cost_for_ml_in_delivery: string
}

export interface InSettingsGPPricePrice {
  minDist: number;
  maxDist: number;
  price: number | null;
}
export interface IHoursRange {
  hour: string;
  minutes: string;
  period: string;
}

export interface IPickUpRange {
  label?: string;
  from: IHoursRange;
  to: IHoursRange;
  selected?: boolean;
}
export interface IPickUpOptions {
  firstRange?: IPickUpRange;
  secondRange?: IPickUpRange;
  customRange?: IPickUpRange;
}

export interface SettingsGPState {
  listSettingsGP: any[];
  billingAccountHolderHistory: SettingsGPHistory[];
  settingsGP: SettingsGP;
  newSettingsGP: SettingsGP;
  newContact: SettingsGPContact;
  filters: Filters;
  billingAccountFilters: SettingsGPPagination;
  meta: { totalCount: number; filteredCount: number };
}

export interface SettingsGPPagination {
  page: number;
  per_page: number;
}

export interface SettingsGPContact {
  fullName: string;
  companyName: string;
  title: string;
  email: string;
  phone: string;
  attachedToCustomerId?: number | null;
  type: 'REPORTING' | 'BILLING';
}

export interface SettingsGPHistory {
  object: any;
  previous: any;
  timestamp: number;
  type: string;
  user: any;
}
