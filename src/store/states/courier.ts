import { Courier } from '../../interfaces';
import { tableHeaders } from '../../constants';

export function initCourier(): Courier {
  return {
    couriers: [],
    courier: {
      _id: '',
      sub: '',
      cognitoId: '',
      name: '',
      family_name: '',
      email: '',
      phone_number: '',
      password: '',
      license: '',
      insurance: '',
      videoPresentation: '',
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
      dateSent: '',
      make: '',
      carModel: '',
      heardFrom: '',
      tShirt: '',
      carYear: '',
      isWorked: false,
      isOnFleet: false,
      welcomePackageSent: false,
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
      },
      teams: []
    },
    filters: {
      sortField: tableHeaders[2].value,
      page: 0,
      search: '',
      order: 'asc',
      status: [],
      checkrStatus: '',
      onboarded: [],
      completedHIPAATraining: '',
      gender: '',
      city: '',
      state: '',
      zipCode: '',
      isOnFleet: undefined
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
