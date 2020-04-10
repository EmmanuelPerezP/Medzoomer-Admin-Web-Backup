import { User } from '../../interfaces';

export function initUser(): User {
  return {
    sub: '',
    name: '',
    cognitoId: '',
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
    isWorked: false,
    carYear: '',
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
  };
}
