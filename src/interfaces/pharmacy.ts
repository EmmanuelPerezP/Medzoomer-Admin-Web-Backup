export interface PharmacyState {
  newPharmacy: Pharmacy;
}

export interface Pharmacy {
  name: string;
  price: string;
  address: string;
  longitude: string;
  latitude: string;
  preview: string;
  agreement: string;
  managerName: string;
  email: string;
  phone_number: string;
  schedule: {
    monday: { open: Date; close: Date; isClosed: boolean };
    tuesday: { open: Date; close: Date; isClosed: boolean };
    wednesday: { open: Date; close: Date; isClosed: boolean };
    thursday: { open: Date; close: Date; isClosed: boolean };
    friday: { open: Date; close: Date; isClosed: boolean };
    saturday: { open: Date; close: Date; isClosed: boolean };
    sunday: { open: Date; close: Date; isClosed: boolean };
  };
}
