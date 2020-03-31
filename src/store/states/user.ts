import { User } from '../../interfaces';

export function initUser(): User {
  return {
    sub: '',
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
    checkrStatus: '',
    createdAt: '',
    make: '',
    carModel: '',
    tShirt: '',
    isWorked: false,
    carYear: '',
    carPhotos: {
      front: '',
      back: '',
      left: '',
      right: ''
    }
  };
}
