import { Pharmacy, PharmacyState } from '../../interfaces';

export function initPharmacy(): PharmacyState {
  return {
    newPharmacy: {
      name: '',
      price: '',
      address: '',
      longitude: '',
      latitude: '',
      preview: '',
      agreement: '',
      managerName: '',
      email: '',
      phone_number: '',
      schedule: {
        monday: { open: new Date(), close: new Date(), isClosed: false },
        tuesday: { open: new Date(), close: new Date(), isClosed: false },
        wednesday: { open: new Date(), close: new Date(), isClosed: false },
        thursday: { open: new Date(), close: new Date(), isClosed: false },
        friday: { open: new Date(), close: new Date(), isClosed: false },
        saturday: { open: new Date(), close: new Date(), isClosed: false },
        sunday: { open: new Date(), close: new Date(), isClosed: false }
      }
    }
  };
}
