import { Filters } from './helpers';

export interface BillingAccount {
  name: string;
  companyName: string;
  title: string;
  email: string;
  phone: string;
}

export interface BillingState {
  billings: any[];
  billing: BillingAccount;
  newBilling: BillingAccount;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface BillingPagination {
  page: number;
  perPage: number;
  search: string;
}
