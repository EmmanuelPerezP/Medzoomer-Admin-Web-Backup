import { AuthState } from '../interfaces';
import { useStores } from '../store';
import {
  logIn,
  logOut,
  sendVerificationCode,
  confirmVerificationCode,
  sendRequestForResetPassword,
  setTokenApi,
  resetPassword,
  changePassword
} from '../store/actions/auth';

export default function useAuth() {
  const { authStore } = useStores();
  return {
    ...authStore.getState(),
    isAuth: Boolean(authStore.get('token')),
    logIn: (user: Partial<AuthState>) => logIn(user),
    logOut: () => logOut(),
    sendVerificationCode: (data: Partial<AuthState>) => sendVerificationCode(data),
    confirmVerificationCode: (data: Partial<AuthState>) => confirmVerificationCode(data),
    sendRequestForResetPassword: (email: string) => sendRequestForResetPassword(email),
    resetPassword: (data: Partial<AuthState>) => resetPassword(data),
    changePassword: (data: any) => changePassword(data),
    setToken: (token: string) => {
      setTokenApi(token);
      authStore.set('token')(token);
    }
  };
}
