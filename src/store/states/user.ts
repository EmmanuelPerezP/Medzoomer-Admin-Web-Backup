export interface User {
  sub: string;
  name: string;
  family_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  birthdate?: string;
  picture?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export function initUser(): User {
  return {
    sub: '',
    name: '',
    family_name: '',
    email: '',
    phone_number: '',
    address: '',
    birthdate: '',
    picture: '',
    city: '',
    state: '',
    zip: ''
  };
}
