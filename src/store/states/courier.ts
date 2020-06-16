import { Courier } from '../../interfaces';
import { filtersStatus, tableHeaders } from '../../constants';

export function initCourier(): Courier {
  return {
    couriers: [],
    courier: {
      sub: '',
      cognitoId: '',
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
      onboarded: false,
      checkrStatus: '',
      completedHIPAATraining: false,
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
        front: '',
        back: '',
        left: '',
        right: ''
      }
    },
    filters: {
      sortField: tableHeaders[2].value,
      page: 0,
      search: '',
      order: 'asc',
      status: filtersStatus[1].value,
      checkrStatus: '',
      onboarded: '',
      completedHIPAATraining: '',
      gender: '',
      city: '',
      state: '',
      zipCode: ''
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
