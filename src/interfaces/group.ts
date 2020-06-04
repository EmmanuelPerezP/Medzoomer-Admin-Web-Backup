import { Filters } from './helpers';

export interface Group {
  name: string;
  bellingAccounts: string;
  pricePerDelivery: number | null;
  volumeOfferPerMonth: number | null;
  volumePrice: number | null;
}

export interface GroupState {
  groups: any[];
  group: Group;
  newGroup: Group;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface GroupPagination {
  page: number;
  perPage: number;
  search: string;
}
