export interface User {
  sub: string;
  name: string;
  status: string;
  onboarded: boolean;
  family_name: string;
  email: string;
  phone_number: string;
  password: string;
  license: string;
  insurance: string;
  birthdate: string;
  address: any;
  latitude: string;
  longitude: string;
  picture: string;
  createdAt: string;
  make: string;
  carModel: string;
  carYear: string;
  checkrStatus: string;
  completedHIPAATraining: boolean;
  tShirt: string;
  isWorked: boolean;
  welcomePackageSent: boolean;
  dateSent: string;
  hellosign: HelloSign;
  cognitoId: string;
  isOnFleet: boolean;
  heardFrom: string;
  photosCar: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
  teams: any[];
  dwolla?: any;
}

export interface HelloSign {
  agreement: string;
  isAgreementSigned: boolean;
  fw9: string;
  isFW9Signed: boolean;
}

export type PharmacyUserStatus = 'ACTIVE' | 'DECLINED' | 'PENDING';

export interface PharmacyUser {
  _id: string;
  sub: string;
  pharmacy: string;
  name: string;
  family_name: string;
  email: string;
  phone_number: string;
  password: string;
  picture: string;
  createdAt: string;
  cognitoId: string;
  jobTitle: string;
  status: PharmacyUserStatus;
  isAdmin: boolean;
}
