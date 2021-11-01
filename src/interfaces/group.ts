import { Filters } from './helpers';
import { PharmacyUser } from './user';

export interface Group {
  name: string;
  settingsGP: string;
}

export type GroupUser = PharmacyUser;

export interface GroupState {
  groups: any[];
  group: Group;
  // Users related to the selected group
  users: GroupUser[];
  newGroup: Group;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface GroupPagination {
  page: number;
  perPage: number;
  search: string;
}
