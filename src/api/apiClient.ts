import { HttpInterface } from './httpAdapter';
import { AuthState, CourierPagination, Pharmacy, PharmacyPagination } from '../interfaces';
import { EventEmitter } from 'events';
import { AxiosRequestConfig } from 'axios';
import { fromEvent, Observable } from 'rxjs';
import ApiError from './apiError';

type ApiClientEvents = 'unauthorized' | string;

export default class ApiClient {
  private _eventEmitter = new EventEmitter();

  constructor(protected http: HttpInterface) {
    http.initErrorResponseInterceptor(async (error) => {
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
      if (error.response!.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: await this.refreshTokens()
          };

          return http.repeatRequest(originalRequest);
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('refresh');

          this._eventEmitter.emit('unauthorized');
        }
      } else {
        throw new ApiError(error, originalRequest.url!);
      }
    });
  }

  public on(event: ApiClientEvents): Observable<any> {
    return fromEvent<any>(this._eventEmitter, event);
  }

  public setToken(token: string) {
    this.http.setAuthorizationToken(token);
  }

  public async refreshTokens(): Promise<string> {
    const data = {
      refreshToken: localStorage.getItem('refresh'),
      idToken: localStorage.getItem('id')
    };

    const res = await this.http.post('/profile-guest/refresh', data);

    this.setToken(res.AccessToken);

    localStorage.setItem('token', res.AccessToken);
    localStorage.setItem('id', res.IdToken);

    if (res.RefreshToken) {
      localStorage.setItem('refresh', res.RefreshToken);
    }

    return res.AccessToken;
  }

  // Not Login
  public logIn(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/admin/sign-in', data);
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

  public uploadFile(userId: string, fileOptions: any) {
    const data = new FormData();
    data.append('key', userId);
    data.append('file', fileOptions);

    return this.http.post('/file', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  public getFileLink(key: string, fileName: string) {
    return this.http.get(`/fileLink/${key}/${fileName}`);
  }

  public getImageLink(key: string, fileName: string) {
    try {
      return this.http.get(`/image/${key}/${fileName}`);
    } catch (err) {
      throw new Error(err);
    }
  }

  // Courier
  public getCouriers(data: CourierPagination) {
    const { perPage, page = 0, search, status, period, sortField, order } = data;
    let query = '';

    if (sortField) {
      query += '&sortField=' + sortField + '&order=' + order;
    }

    if (search) {
      query += '&search=' + encodeURIComponent(search);
    }

    if (status) {
      query += '&status=' + status;
    }

    if (period) {
      query += '&period=' + period;
    }

    return this.http.get(`/profile-auth/couriers?perPage=${perPage}&page=${page}${query}`);
  }

  public getCourier(id: string) {
    return this.http.get(`/profile-auth/couriers/${id}`);
  }

  public updateCourierStatus(id: string, status: string) {
    return this.http.patch(`/profile-auth/couriers/${id}`, { status });
  }

  // Pharmacy
  public getPharmacies(data: PharmacyPagination) {
    const { perPage, page = 0, search } = data;
    let query = '';

    if (search) {
      query += '&search=' + search;
    }

    return this.http.get(`/profile-auth/pharmacies?perPage=${perPage}&page=${page}${query}`);
  }

  public getPharmacy(id: string) {
    return this.http.get(`/profile-auth/pharmacies/${id}`);
  }

  public createPharmacy(data: Partial<Pharmacy>) {
    return this.http.post(`/profile-auth/pharmacies`, data);
  }

  public updatePharmacy(id: string, data: Partial<Pharmacy>) {
    return this.http.patch(`/profile-auth/pharmacies/${id}`, data);
  }
}
