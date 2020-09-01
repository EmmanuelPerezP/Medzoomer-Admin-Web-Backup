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
    onboarded: false,
    checkrStatus: '',
    isOnFleet: false,
    completedHIPAATraining: false,
    createdAt: '',
    make: '',
    carModel: '',
    tShirt: '',
    isWorked: false,
    welcomePackageSent: false,
    dateSent: '',
    carYear: '',
    heardFrom: '',
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
  };
}
