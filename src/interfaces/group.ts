import { Filters } from './helpers';

export interface Group {
  name: string;
  billingAccount: string;
  prices: GroupPrice[]
}

export interface GroupPrice {
  orderCount: string,
  prices: InGroupPricePrice []
}

export interface InGroupPricePrice {
  minDist: number,
  maxDist: number,
  price: number,
}

export interface GroupState {
  groups: any[];
  group: Group;
  newGroup: Group;
  newContact: GroupContact;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface GroupState {
  groups: any[];
  group: Group;
  newGroup: Group;
  newContact: GroupContact;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface GroupPagination {
  page: number;
  perPage: number;
  search: string;
}

export interface GroupContact {
  fullName: string;
  companyName: string;
  title: string;
  email: string;
  phone: string;
  type: 'REPORTING' | 'BILLING';
}
