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
  invoicedId?: number | null;
  billingAccountHolder: BillingAccount;
  amountOrdersInBatch: number;
  billingAccount: string;
  calculateDistanceForSegments: string;
  forcedPrice: number | null;
  prices: SettingsGPPrice[];
}

export interface SettingsGPPrice {
  orderCount: string;
  prices: InSettingsGPPricePrice[];
}

export interface InSettingsGPPricePrice {
  minDist: number;
  maxDist: number;
  price: number | null;
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
  type: 'REPORTING' | 'BILLING';
}

export interface SettingsGPHistory {
  object: any;
  previous: any;
  timestamp: number;
  type: string;
  user: any;
}
