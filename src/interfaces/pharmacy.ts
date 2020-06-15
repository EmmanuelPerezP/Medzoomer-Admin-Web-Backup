import { Period } from '../types';
import { Filters } from './helpers';

export interface PharmacyState {
  newPharmacy: Pharmacy;
  pharmacies: any[];
  pharmacy: Pharmacy;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

// TODO fix and apply to schedule
type Day = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: {
    open: Time;
    close: Time;
    isClosed: boolean;
  };
};

interface Time {
  hour: string;
  minutes: string;
  period: Period;
}

export interface Pharmacy {
  group: string;
  billingAccount: string;
  pricePerDelivery: string;
  volumeOfferPerMonth: string;
  volumePrice: string;
  name: string;
  price: string;
  address: any;
  roughAddress: string;
  longitude: string;
  latitude: string;
  preview: string;
  agreement: {
    name: string;
    link: string;
    fileKey: string;
  };
  managerName: string;
  email: string;
  phone_number: string;
  status: string;
  schedule: {
    [key: string]: { [key: string]: any | { [key: string]: string | Period } | boolean };
  };
}

export interface PharmacyPagination {
  page: number;
  perPage: number;
  search: string;
}
