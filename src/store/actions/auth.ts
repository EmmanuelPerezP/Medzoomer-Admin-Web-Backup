import api from '../../api';
import { AuthState } from '../../interfaces';

export function setTokenApi(token: string) {
  api.setToken(token);
}

export async function logIn(data: Partial<AuthState>) {
  const response = await api.logIn(data);
  setTokenApi(response.AccessToken);
  localStorage.setItem('token', response.AccessToken);
  localStorage.setItem('id', response.IdToken);
  localStorage.setItem('refresh', response.RefreshToken);

  return response;
}

export async function logOut() {
  try {
    await api.logOut();
  } catch (e) {
    console.error(e && e.message);
  }
  setTokenApi('');
  localStorage.setItem('token', '');
  localStorage.setItem('id', '');
  localStorage.setItem('refresh', '');
}

export async function sendVerificationCode(data: Partial<AuthState>) {
  const response = await api.sendVerificationCode(data);
  return response;
}

export async function confirmVerificationCode(data: Partial<AuthState>) {
  const response = await api.confirmVerificationCode(data);
  return response;
}

export async function sendRequestForResetPassword(email: string) {
  const response = await api.sendRequestForResetPassword(email);
  return response;
}

export async function resetPassword(data: Partial<AuthState>) {
  const response = await api.resetPassword(data);
  return response;
}
