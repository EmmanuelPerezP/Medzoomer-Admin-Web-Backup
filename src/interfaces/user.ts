export interface User {
  sub: string;
  name: string;
  status: string;
  family_name: string;
  email: string;
  phone_number: string;
  password: string;
  license: { preview: string; key: string };
  insurance: { preview: string; key: string };
  birthdate: string;
  address: string;
  latitude: string;
  longitude: string;
  picture: string;
  createdAt: string;
  make: string;
  carModel: string;
  carYear: string;
  checkrStatus: string;
  tShirt: string;
  isWorked: boolean;
  hellosign: HelloSign;
  photosCar: {
    front: { preview: string; key: string };
    back: { preview: string; key: string };
    left: { preview: string; key: string };
    right: { preview: string; key: string };
  };
}

export interface HelloSign {
  agreement: string;
  isAgreementSigned: boolean;
  fw9: string;
  isFW9Signed: boolean;
}
