import { User } from './user';
import { Filters } from './helpers';

export interface Courier {
  courier: User;
  couriers: any[];
  filters: CourierFilters;
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
  checkrStatus?: string;
  completedHIPAATraining?: string;
  onboarded?: string;
  gender?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface CourierFilters extends Filters {
  status: string;
  checkrStatus?: string;
  completedHIPAATraining?: string;
  onboarded?: string;
  gender?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isOnFleet?: boolean;
}
