import { Filters } from './helpers';

export interface BillingAccount {
  id?: number | null;
  attention_to?: string;
  companyName: string;
  email: string;
  name?: string;
  number?: string;
  phone: string;
  title?: string;
}

export interface BillingState {
  billings: any[];
  billing: BillingAccount;
  newBilling: BillingAccount;
  filters: Filters;
  billingAccountFilters: any;
  meta: { totalCount: number; filteredCount: number };
}

export interface BillingPagination {
  page: number;
  perPage: number;
  search: string;
}
