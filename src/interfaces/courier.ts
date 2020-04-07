import { User } from './user';

export interface Courier {
  courier: User;
  couriers: any[];
  meta: { totalCount: number; filteredCount: number };
}

export interface CourierPagination {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  sortField?: string;
  order?: string;
  period?: number;
}

export interface CourierImages {
  license?: string;
  picture?: string;
  insurance?: string;
  front?: string;
  back?: string;
  left?: string;
  right?: string;
}
