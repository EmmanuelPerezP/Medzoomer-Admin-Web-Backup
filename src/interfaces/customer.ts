import { User } from './user';
import { Filters } from './helpers';

export interface CustomerState {
  customer: Customer;
  customers: any[];
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface Customer {
  name: string;
  family_name: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    apartment: string;
    state: string;
    postalCode: string;
    country: string;
    city: string;
    street: string;
    number: string;
  };
  latitude: string;
  longitude: string;
  notes: string;
  billing_token: string;
}

export interface CustomerPagination {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: string;
  order?: string;
  period?: number;
}
