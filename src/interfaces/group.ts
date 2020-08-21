import { Filters } from './helpers';

export interface Group {
  name: string;
  billingAccount: string;
  pricePerDelivery: number | null;
  volumeOfferPerMonth: number | null;
  volumePrice: number | null;
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
