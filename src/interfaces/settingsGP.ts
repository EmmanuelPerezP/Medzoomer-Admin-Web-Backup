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
