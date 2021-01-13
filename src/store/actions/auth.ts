import api from '../../api';
import { AuthState } from '../../interfaces';

export function setTokenApi(token: string) {
  api.setToken(token);
}

export async function logIn(data: Partial<AuthState>) {
  const response = await api.logIn(data);

  if (response.AccessToken) {
    setTokenApi(response.AccessToken);
    sessionStorage.setItem('token', response.AccessToken);
    sessionStorage.setItem('id', response.IdToken);
    sessionStorage.setItem('refresh', response.RefreshToken);
  }

  return response;
}

export async function logOut() {
  try {
    await api.logOut();
  } catch (e) {
    console.error(e && e.message);
  }
  setTokenApi('');
  sessionStorage.setItem('token', '');
  sessionStorage.setItem('id', '');
  sessionStorage.setItem('refresh', '');
  window.location.reload();
}

export async function sendVerificationCode(data: Partial<AuthState>) {
  const response = await api.sendVerificationCode(data);
  return response;
}

export async function changePassword(data: any) {
  const response = await api.changePassword(data);
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
