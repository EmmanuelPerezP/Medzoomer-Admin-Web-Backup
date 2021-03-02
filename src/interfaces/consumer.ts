import { Filters } from './helpers';
export interface ConsumerState {
  consumer: Consumer;
  consumers: any[];
  filters: ConsumerFilters;
  meta: { totalCount: number; filteredCount: number };
}

export interface ConsumerFilters extends Filters {
  fullName: string;
  phone: string;
  email: string;
}

export interface Consumer {
  _id: string;
  name: string;
  family_name: string;
  fullName: string;
  dob: string;
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
  status: string;
  latitude: string;
  longitude: string;
  notes: string;
  billing_token: string;
}

export interface ConsumerPagination {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: string;
  order?: string;
  period?: number;
  email?: string;
  phone?: string;
  fullName?: string;
}
