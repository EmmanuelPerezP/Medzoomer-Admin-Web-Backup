export interface User {
  sub: string;
  name: string;
  status: string;
  family_name: string;
  email: string;
  phone_number: string;
  password: string;
  license: string;
  insurance: string;
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
  carPhotos: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
}
