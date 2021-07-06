import { Period } from '../types';

export interface User {
  _id: string;
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
  videoPresentation: string;
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
  checkrId?: string;
  checkrInvLink?: string;
  completedHIPAATraining: boolean;
  tShirt: string;
  hatQuestion: boolean;
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
  schedule?: {
    [key: string]: { [key: string]: any | { [key: string]: string | Period } | boolean };
  };
  timezone?: string;
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
