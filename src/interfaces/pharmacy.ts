import { Period } from '../types';
import { Filters } from './helpers';
import { PharmacyUser } from './user';

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

interface IReferrals {
  pharmacyName: string,
  managerName: string,
  contactInfo: string
}

interface IManagers {
  primaryContact: {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
  },
  secondaryContact: {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
  }
}

export interface Pharmacy {
  _id?: string;
  groups: any;
  group: string;
  hvDeliveries: string;
  hvPriceFirstDelivery: string;
  // hvPriceFollowingDeliveries: string;
  hvPriceHighVolumeDelivery: string;
  rcEnable: boolean;
  rcFlatFeeForCourier?: number | null;
  rcFlatFeeForPharmacy?: number | null;
  billingAccount: string;
  pricePerDelivery: string;
  volumeOfferPerMonth: string;
  volumePrice: string;
  name: string;
  price: string;
  roughAddressObj: any;
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
  managerPhoneNumber?: string;
  status: string;
  schedule: {
    [key: string]: { [key: string]: any | { [key: string]: string | Period } | boolean };
  };
  dayPlannedDeliveryCount?: string;
  users?: PharmacyUser[];
  settingsGP?: string;
  affiliation?: string;
  hellosign?: {
    agreement: string;
    isAgreementSigned: boolean;
  };
  signedAgreementUrl: string;
  managers: IManagers,
  expectedDeliveryRadius: string;
  assistedLivingFacilitiesOrGroupHomes: {
    value: string;
    volume: string;
  };
  existingDrivers: {
    value: string;
    volume: string;
  },
  specialInstructions: string,
  referrals: Array<IReferrals>,
  controlledMedications: {
    value: string;
    specialRequirementsNote: string;
    signature: boolean;
    photoOfId: boolean;
    specialRequirements: boolean;
  },
  isContactlessDelivery: string;
  reportedBackItems: {
    customerName: boolean;
    rxNumber: boolean;
    signature: boolean;
    date: boolean;
    medicationName: boolean;
    deliveryConfirmationPhotos: boolean;
  },
  timeForCouriers: string,
  ordersSettings: {
    medicationDetails: boolean;
    rxCopay: boolean;
  },
}

export interface PharmacyPagination {
  page?: number;
  perPage: number;
  search?: string;
  order: string;
  sortField: string;
  affiliation?: string;
  period?: number;
  addGroupInfo?: number;
  addSettingsGPInfo?: number;
}

export interface PharmacyReport {
  _id: string;
  name: string;
  pharmacy: string;
  token: string;
  url?: string;
  expiredAt: string;
  createdAt: string;
  updatedAt?: string;
}
