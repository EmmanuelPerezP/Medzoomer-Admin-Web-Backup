import { AuthState } from '../../interfaces';

export function initAuth(): AuthState {
  return {
    token: localStorage.getItem('token') || '',
    refresh: '',
    email: '',
    password: '',
    phone_number: '',
    code: '',
    step: '',
    fullName: '',
    month: '',
    year: '',
    day: '',
    address: '',
    longitude: '',
    latitude: '',
    license: '',
    insurance: '',
    sub: '',
    picture: ''
  };
}
