import { User } from '../../interfaces';

export function initUser(): User {
  return {
    _id: '',
    sub: '',
    name: '',
    cognitoId: '',
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
    isOnFleet: false,
    completedHIPAATraining: false,
    createdAt: '',
    make: '',
    carModel: '',
    tShirt: '',
    hatQuestion: false,
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
