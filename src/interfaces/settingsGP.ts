import { Filters } from './helpers';

export interface SettingsGP {
  name: string;
  invoiceFrequency: string;
  isManualBatchDeliveries: string;
  autoDispatchTimeframe: string;
  dispatchedBeforeClosingHours: string;
  maxDeliveryLegDistance: string;
  invoiceFrequencyInfo: number;
  billingAccount: string;
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
  settingsGP: SettingsGP;
  newSettingsGP: SettingsGP;
  newContact: SettingsGPContact;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface SettingsGPPagination {
  page: number;
  perPage: number;
  search: string;
}

export interface SettingsGPContact {
  fullName: string;
  companyName: string;
  title: string;
  email: string;
  phone: string;
  type: 'REPORTING' | 'BILLING';
}
