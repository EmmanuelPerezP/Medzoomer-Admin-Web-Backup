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
      checkrStatus: '',
      createdAt: '',
      make: '',
      carModel: '',
      tShirt: '',
      carYear: '',
      isWorked: false,
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
