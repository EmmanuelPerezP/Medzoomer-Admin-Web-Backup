import { HttpInterface } from './httpAdapter';
import {
  AuthState,
  BillingAccount,
  BillingPagination,
  Consumer,
  ConsumerPagination,
  CourierPagination,
  DeliveryPagination,
  Group,
  GroupPagination,
  Pharmacy,
  PharmacyPagination,
  TransactionPagination
} from '../interfaces';
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
        if ((error.response as any).status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('refresh');
          this._eventEmitter.emit('unauthorized');
        }
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

    const res = await this.http.post('/profile-guest/admin/refresh', data);

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
    return this.http.post('profile-guest/admin/forgot-password', { email });
  }

  public resetPassword(data: Partial<AuthState>) {
    return this.http.post('/profile-guest/admin/reset-password', data);
  }

  public changePassword(data: any) {
    return this.http.patch('/profile-guest/admin/change-password', data);
  }

  // Login
  public logOut() {
    return this.http.post('/profile-auth/sign-out');
  }

  public getUser() {
    return this.http.get('/profile-auth');
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

  public async getFileLink(key: string, fileName: string) {
    try {
      return await this.http.get(`/fileLink/${key}/${fileName}`);
    } catch (err) {
      console.error(err);
      return { link: '' };
    }
  }

  public async getImageLink(key: string, fileName: string) {
    try {
      return await this.http.get(`/image/${key}/${fileName}`);
    } catch (err) {
      console.error(err);
      return { link: '' };
    }
  }

  public getQuery = (data: any) => {
    const {
      search,
      status,
      assigned,
      period,
      sortField,
      order,
      checkrStatus,
      completedHIPAATraining,
      gender,
      onboarded,
      sub,
      city,
      state,
      zipCode,
      customerId
    } = data;
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

    if (assigned) {
      query += '&assigned=' + assigned;
    }

    if (period) {
      query += '&period=' + period;
    }

    if (customerId) {
      query += '&customerId=' + customerId;
    }

    if (checkrStatus) {
      query += '&checkrStatus=' + checkrStatus;
    }

    if (completedHIPAATraining) {
      query += '&completedHIPAATraining=' + completedHIPAATraining;
    }

    if (gender) {
      query += '&gender=' + gender;
    }

    if (sub) {
      query += '&sub=' + sub;
    }

    if (city) {
      query += '&city=' + city;
    }

    if (state) {
      query += '&state=' + state;
    }

    if (zipCode) {
      query += '&zipCode=' + zipCode;
    }

    // Rename via xss
    if (onboarded) {
      query += '&isOnboarding=' + onboarded;
    }

    return query;
  };

  // Courier
  public getCouriers(data: CourierPagination) {
    const {
      perPage = 10,
      page = 0,
      city,
      state,
      zipCode,
      checkrStatus,
      completedHIPAATraining,
      gender,
      onboarded,
      order,
      search,
      sortField,
      status
    } = data;

    // const query = this.getQuery(data);
    let query = '';
    // onboarded: '';
    // status: 'REGISTERED';
    if (sortField) {
      query += '&sortField=' + sortField + '&order=' + order;
    }

    if (search) {
      query += '&search=' + encodeURIComponent(search);
    }

    if (status) {
      if (onboarded !== 'true') {
        query += '&status=' + onboarded;
      } else {
        query += '&status=' + status;
      }
    }

    if (checkrStatus) {
      query += '&checkrStatus=' + checkrStatus;
    }

    if (completedHIPAATraining) {
      query += '&completedHIPAATraining=' + completedHIPAATraining;
    }

    if (gender) {
      query += '&gender=' + gender;
    }

    if (city) {
      query += '&city=' + city;
    }

    if (state) {
      query += '&state=' + state;
    }

    if (zipCode) {
      query += '&zipCode=' + zipCode;
    }

    // Rename via xss
    if (onboarded && onboarded === 'true') {
      query += '&isOnboarding=' + onboarded;
    }

    return this.http.get(`/couriers?perPage=${perPage}&page=${page}${query}`);
  }

  public exportCouriers(data: CourierPagination) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/couriers/export?perPage=${perPage}&page=${page}${query}`);
  }

  public getCourier(id: string) {
    return this.http.get(`/couriers/${id}`);
  }

  public updateCourierStatus(id: string, status: string) {
    return this.http.patch(`/couriers/${id}`, { status });
  }

  public courierSearchField(field: string, search: string, limit: number) {
    return this.http.get(`/couriers/search/field`, { search, field, limit });
  }

  public updateCourierOnboarded(id: string, onboarded: boolean) {
    return this.http.patch(`/couriers/${id}/onboarded`, { onboarded });
  }

  public updateCourierPackage(id: string, welcomePackageSent: boolean) {
    return this.http.patch(`/couriers/${id}/welcomePackageSent`, { welcomePackageSent });
  }

  public updateCourierisOnFleet(id: string, isOnFleet: boolean) {
    return this.http.patch(`/couriers/${id}/isOnFleet`, { isOnFleet });
  }

  public createOnfleetWorker(userId: string) {
    return this.http.post(`/workers/`, { userId });
  }

  // Pharmacy
  public getPharmacies(data: PharmacyPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/pharmacies?perPage=${perPage}&page=${page}${query}`);
  }

  public getPharmacy(id: string) {
    return this.http.get(`/pharmacies/${id}`);
  }

  public createPharmacy(data: Partial<Pharmacy>) {
    return this.http.post(`/pharmacies`, data);
  }

  public updatePharmacy(id: string, data: Partial<Pharmacy>) {
    return this.http.patch(`/pharmacies/${id}`, data);
  }

  // groups
  public getGroups(data: GroupPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/groups?perPage=${perPage}&page=${page}${query}`);
  }

  public getAllGroups() {
    return this.http.get(`/groups?all=1`);
  }

  public getGroup(id: string) {
    return this.http.get(`/groups/${id}`);
  }

  public getPharmacyInGroup(id: string) {
    return this.http.get(`/groups/pharmacy/${id}`);
  }

  public createGroup(data: Partial<Group>) {
    return this.http.post(`/groups`, data);
  }

  public updateGroup(id: string, data: Partial<Group>) {
    return this.http.patch(`/groups/${id}`, data);
  }

  public removeGroup(id: string) {
    return this.http.delete(`/groups/${id}`, {});
  }

  // customers
  public getConsumers(data: ConsumerPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/customers?perPage=${perPage}&page=${page}${query}`);
  }

  public getConsumer(id: string) {
    return this.http.get(`/customers/${id}`);
  }

  public createConsumer(data: Partial<Consumer>) {
    return this.http.post(`/customers`, data);
  }

  public updateConsumer(id: string, data: Partial<Consumer>) {
    return this.http.put(`/customers/${id}`, data);
  }

  public updateConsumerStatus(id: string, status: string) {
    return this.http.patch(`/customers/${id}`, { status });
  }

  // settings
  public getSetting(list: string[]) {
    return this.http.get(`/settings`, { list });
  }

  public updateSetting(key: string, value: string) {
    return this.http.patch(`/settings/${key}`, { value });
  }

  public updateListSettings(settings: object) {
    return this.http.put(`/settings`, { settings });
  }

  // deliveries
  public getDeliveries(data: DeliveryPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/deliveries?perPage=${perPage}&page=${page}${query}`);
  }

  public getDeliveriesCourier(data: DeliveryPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/deliveries/courier?perPage=${perPage}&page=${page}${query}`);
  }

  public getDelivery(id: string) {
    return this.http.get(`/deliveries/${id}`);
  }

  // transactions
  public getTransactions(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/transactions?perPage=${perPage}&page=${page}${query}`);
  }

  public getTransactionsByPharmacy(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/transactions/pharmacies?perPage=${perPage}&page=${page}${query}`);
  }

  public getTransaction(id: string) {
    return this.http.get(`/transactions/${id}`);
  }

  // billings
  public getBillings(data: BillingPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/billing-accounts?perPage=${perPage}&page=${page}${query}`);
  }

  public getAllBillings() {
    return this.http.get(`/billing-accounts?all=1`);
  }

  public getBilling(id: string) {
    return this.http.get(`/billing-accounts/${id}`);
  }

  public createBilling(data: Partial<BillingAccount>) {
    return this.http.post(`/billing-accounts`, data);
  }

  public updateBilling(id: string, data: Partial<BillingAccount>) {
    return this.http.patch(`/billing-accounts/${id}`, data);
  }

  public removeBilling(id: string) {
    return this.http.delete(`/billing-accounts/${id}`, {});
  }
}
