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
      license: { preview: '', key: '' },
      insurance: { preview: '', key: '' },
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
      hellosign: {
        fw9: '',
        isAgreementSigned: false,
        isFW9Signed: false,
        agreement: ''
      },
      photosCar: {
        front: { preview: '', key: '' },
        back: { preview: '', key: '' },
        left: { preview: '', key: '' },
        right: { preview: '', key: '' }
      }
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
