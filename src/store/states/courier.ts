import { Courier } from '../../interfaces';

export function initCourier(): Courier {
  return {
    couriers: [],
    courier: {
      sub: '',
      name: '',
      family_name: '',
      email: '',
      phone_number: '',
      password: '',
      license: '',
      insurance: '',
      birthdate: '',
      address: '',
      latitude: '',
      longitude: '',
      picture: '',
      status: '',
      createdAt: '',
      make: '',
      carModel: '',
      carYear: '',
      carPhotos: {
        front: '',
        back: '',
        left: '',
        right: ''
      }
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
