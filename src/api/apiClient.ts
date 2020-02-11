import { HttpInterface } from './httpAdapter';
import { AuthState, CourierPagination } from '../interfaces';

export default class ApiClient {
  constructor(protected http: HttpInterface) {}

  public setToken(token: string) {
    this.http.setAuthorizationToken(token);
  }

  // Not Login
  public logIn(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/sign-in', data);
  }

  public getHealthCheck() {
    return this.http.get('/profile-guest/health-check');
  }

  public sendVerificationCode(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/sign-up', data);
  }

  public confirmVerificationCode(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/sign-up/confirm', data);
  }

  public sendRequestForResetPassword(email: string) {
    return this.http.post('profile-guest/forgot-password', { email });
  }

  public resetPassword(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/reset-password', data);
  }

  // Login
  public logOut() {
    return this.http.post('/profile-auth/sign-out');
  }

  public getUser() {
    return this.http.get('/profile-auth');
  }

  public completeProfile(options: any) {
    return this.http.put('/profile-auth/sign-up/complete-profile', options);
  }

  public updateProfilePicture(url: string) {
    return this.http.put('/profile-auth/sign-up/set-picture', { picture: url });
  }

  public updateProfile(options: any) {
    return this.http.put('/profile-auth/profile', options);
  }

  public uploadImage(userId: string, imageOptions: any, size: any) {
    const data = new FormData();
    data.append('key', userId);
    data.append('image', imageOptions);
    data.append('size', JSON.stringify(size));

    return this.http.post('/image', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  // Courier
  public getCouriers(data: CourierPagination) {
    const { perPage, page = 0, search, status } = data;
    let query = '';

    if (search) {
      query += '&search=' + search;
    }

    if (status) {
      query += '&status=' + status;
    }

    return this.http.get(`/profile-auth/couriers?perPage=${perPage}&page=${page}${query}`);
  }

  public getCourier(id: string) {
    return this.http.get(`/profile-auth/couriers/${id}`);
  }

  public updateCourierStatus(id: string, status: string) {
    return this.http.patch(`/profile-auth/couriers/${id}`, { status });
  }
}
