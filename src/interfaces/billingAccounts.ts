import { Filters } from './helpers';

export interface BillingAccounts {
  name: string;
  companyName: string;
  title: string,
  email: string,
  phone: string,
}

export interface BillingState {
  billings: any[];
  billing: BillingAccounts;
  newBilling: BillingAccounts;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface BillingPagination {
  page: number;
  perPage: number;
  search: string;
}
