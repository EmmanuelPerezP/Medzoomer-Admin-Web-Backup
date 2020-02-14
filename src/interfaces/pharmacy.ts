import { Period } from '../types';

export interface PharmacyState {
  newPharmacy: Pharmacy;
  pharmacies: any[];
  pharmacy: Pharmacy;
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
  name: string;
  price: string;
  address: string;
  longitude: string;
  latitude: string;
  preview: string;
  agreement: {
    name: string;
    link: string;
  };
  managerName: string;
  email: string;
  phone_number: string;
  schedule: {
    [key: string]: { [key: string]: any | { [key: string]: string | Period } | boolean };
    // monday: Day;
    // tuesday: Day;
    // wednesday: Day;
    // thursday: Day;
    // friday: Day;
    // saturday: Day;
    // sunday: Day;
  };
}

export interface PharmacyPagination {
  page: number;
  perPage: number;
  search: string;
}
