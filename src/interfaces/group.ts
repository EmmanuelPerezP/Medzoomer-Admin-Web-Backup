import { Filters } from './helpers';

export interface Group {
  name: string;
  fee: string;
  policy: string;
}

export interface GroupState {
  groups: any[];
  group: Group;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface GroupPagination {
  page: number;
  perPage: number;
  search: string;
}
