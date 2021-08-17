import { HttpInterface } from './httpAdapter';
import {
  AuthState,
  BillingAccount,
  BillingPagination,
  Consumer,
  ConsumerPagination,
  CourierPagination,
  DeliveryPagination,
  Filters,
  Group,
  GroupPagination,
  ConsumerOrderPagination,
  Pharmacy,
  PharmacyPagination,
  PharmacyUser,
  PharmacyUserStatus,
  TransactionPagination,
  OrderQueryParams,
  BatchQueryParams
} from '../interfaces';
import { EventEmitter } from 'events';
import { AxiosRequestConfig } from 'axios';
import { fromEvent, Observable } from 'rxjs';
import ApiError from './apiError';
import { IPharmacyRCSettings } from '../interfaces/_types';
// import { reSendInvoice } from '../store/actions/settingGP';

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
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('refresh');

          this._eventEmitter.emit('unauthorized');
        }
      } else {
        if ((error.response as any).status === 401) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('id');
          sessionStorage.removeItem('refresh');
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
      refreshToken: sessionStorage.getItem('refresh'),
      idToken: sessionStorage.getItem('id')
    };

    const res = await this.http.post('/profile-guest/admin/refresh', data);

    this.setToken(res.AccessToken);

    sessionStorage.setItem('token', res.AccessToken);
    sessionStorage.setItem('id', res.IdToken);

    if (res.RefreshToken) {
      sessionStorage.setItem('refresh', res.RefreshToken);
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

  public updateAdmin(options: any) {
    return this.http.put('/profile-auth/admin', options);
  }

  public deleteAdminImage(userId: string, preview: string) {
    return this.http.get('/profile-auth/admin/delete-image', { userId, preview });
  }

  public uploadImage(userId: string, imageOptions: any, size: any) {
    const data = new FormData();
    data.append('key', userId);
    data.append('image', imageOptions);
    data.append('size', JSON.stringify(size));

    const route =
      process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.includes('localhost')
        ? 'http://localhost:5000/image'
        : '/image';

    return this.http.post(route, data, {
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
      type,
      checkrStatus,
      completedHIPAATraining,
      gender,
      onboarded,
      sub,
      city,
      state,
      zipCode,
      customerId,
      courier,
      endDate,
      pharmacy,
      startDate,
      fullName,
      phone,
      email,
      affiliation,
      isCopay,
      addGroupInfo,
      addSettingsGPInfo,
      isDispatched
    } = data;
    let query = '';

    if (addSettingsGPInfo) {
      query += '&addSettingsGPInfo=' + addSettingsGPInfo;
    }

    if (addGroupInfo) {
      query += '&addGroupInfo=' + addGroupInfo;
    }

    if (affiliation) {
      query += '&affiliation=' + affiliation;
    }

    if (isCopay) {
      query += '&isCopay=' + isCopay;
    }

    if (isDispatched) {
      query += '&isDispatched=' + isDispatched;
    }

    if (sortField) {
      query += '&sortField=' + sortField + '&order=' + order;
    }

    if (search) {
      query += '&search=' + encodeURIComponent(search);
    }

    if (status) {
      query += '&status=' + status;
    }

    if (type) {
      query += '&type=' + type;
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

    if (courier && typeof courier === 'string') {
      query += '&courier=' + courier;
    } else if (courier && typeof courier === 'object' && courier._id) {
      query += '&courier=' + courier._id;
    }

    if (pharmacy && typeof pharmacy === 'string') {
      query += '&pharmacy=' + pharmacy;
    } else if (pharmacy && typeof pharmacy === 'object' && pharmacy._id) {
      query += '&pharmacy=' + pharmacy._id;
    }

    if (startDate) {
      query += '&startDate=' + startDate;
    }

    if (endDate) {
      query += '&endDate=' + endDate;
    }

    if (fullName) {
      query += '&fullName=' + fullName;
    }

    if (phone) {
      query += '&phone=' + phone;
    }

    if (email) {
      query += '&email=' + encodeURIComponent(email);
    }

    // Rename via xss
    if (onboarded) {
      query += '&isOnboarding=' + onboarded;
    }

    return query;
  };

  public getCourierQuery = (data: any) => {
    const {
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
      status,
      period,
      isOnFleet
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

    if (checkrStatus) {
      query += '&checkrStatus=' + checkrStatus;
    }

    if (completedHIPAATraining) {
      query += '&completedHIPAATraining=' + completedHIPAATraining;
    }

    if (gender) {
      query += '&gender=' + gender;
    }

    if (isOnFleet) {
      query += '&isOnFleet=' + isOnFleet;
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

    if (period) {
      query += '&period=' + period;
    }

    // Rename via xss
    if (onboarded) {
      query += '&boarding=' + onboarded;
    }

    return query;
  };

  // Courier
  public getCouriers(data: CourierPagination) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getCourierQuery(data);
    return this.http.get(`/couriers?perPage=${perPage}&page=${page}${query}`);
  }

  public exportCouriers(data: CourierPagination) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getCourierQuery(data);

    return this.http.get(`/couriers/export?perPage=${perPage}&page=${page}${query}`);
  }

  public exportDeliveries(data: CourierPagination) {
    // const query = this.getQuery(data);

    return this.http.get(`/deliveries/export`, data);
  }

  public getCourier(id: string) {
    return this.http.get(`/couriers/${id}`);
  }

  public updateCourierStatus(id: string, status: string) {
    return this.http.patch(`/couriers/${id}`, { status });
  }

  public reAddToOnfleet(id: string) {
    return this.http.patch(`/couriers/re-adding-to-onfleet/${id}`, {});
  }

  public increaseCourierBalance(id: string, amount: number) {
    return this.http.patch(`/couriers/increase-courier-balance/${id}`, { amount });
  }

  public courierSearchField(field: string, search: string, limit: number, status: string) {
    return this.http.get(`/couriers/search/field`, { search, field, limit, status });
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

  public getReportsInPharmacy(id: string, data: PharmacyPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/pharmacies/${id}/reports?perPage=${perPage}&page=${page}${query}`);
  }

  public pharmacySearchField(field: string, search: string, limit: number) {
    return this.http.get(`/pharmacies/search/field`, { search, field, limit });
  }

  public createPharmacy(data: Partial<Pharmacy>) {
    return this.http.post(`/pharmacies`, data);
  }

  public updatePharmacy(id: string, data: Partial<Pharmacy>) {
    return this.http.patch(`/pharmacies/${id}`, data);
  }

  public addGroupToPharmacy(id: string, groupId: string) {
    return this.http.patch(`/pharmacies/${id}/group/${groupId}/add`);
  }

  public removeGroupFromPharmacy(id: string, groupId: string) {
    return this.http.patch(`/pharmacies/${id}/group/${groupId}/remove`);
  }

  public getGroupsInPharmacy(id: string) {
    return this.http.get(`/pharmacies/${id}/groups`);
  }

  public exportPharmacies(data: Filters) {
    return this.http.get(`/pharmacies/export`, data);
  }

  public sendAdditionalPharmacyFee(id: string, amount: number) {
    return this.http.post(`/pharmacies/${id}/send-additional-fee`, { amount });
  }

  public updatePharmacyRCSettings(id: string, data: IPharmacyRCSettings) {
    return this.http.post(`/pharmacies/${id}/update-rc-settings`, data);
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

  public addContact(id: string, data: any) {
    return this.http.post(`/groups/${id}/contacts`, data);
  }

  public getContacts(id: string) {
    return this.http.get(`/groups/${id}/contacts`);
  }

  public getManagers(id: string) {
    return this.http.get(`/groups/${id}/managers`);
  }

  public removeContact(id: string, contactId: string) {
    return this.http.delete(`/groups/${id}/contacts/${contactId}`);
  }

  public generateReport(data?: { groupId: string }) {
    return this.http.post('/report/groups', data);
  }

  public generatePharmaciesReport() {
    return this.http.post('/report/pharmacies');
  }

  public sendInvoices(data?: { groupId: string }) {
    return this.http.post('/invoiced/send/group', data);
  }

  public resendReport(id: string) {
    return this.http.post(`/report-manual/${id}/resend`);
  }

  public regenerateReport(id: string) {
    return this.http.post(`/report-manual/${id}/regenerate`);
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

  public getConsumerOrders(id: string, data: ConsumerOrderPagination) {
    const { page = 0, perPage } = data;
    const query = this.getQuery(data);
    return this.http.get(`/customers/orders/${id}?perPage=${perPage}&page=${page}${query}`);
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

  public consumerSearchField(field: string, search: string, limit: number, withID?: boolean) {
    return this.http.get(`/customers/search/field`, { search, field, limit, withID: Boolean(withID) });
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

  // settings GP
  public getSettingGP(id: string) {
    return this.http.get(`/settings-gp`, { id });
  }

  public getDefaultSettingGP() {
    return this.http.get(`/settings-gp/default`);
  }

  public getBillingAccount(search: string) {
    return this.http.get(`/invoiced/billing-account`, { search });
  }

  public getSettingListGP(data: any) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/settings-gp/list?perPage=${perPage}&page=${page}${query}`);
  }

  public getInvoiceQueue(data: any) {
    return this.http.get(`/invoiced/queue`, data);
  }

  public getInvoiceDeliveriesByQueue(data: any) {
    return this.http.get(`/invoiced/history/deliveries`, data);
  }

  public getInvoiceHistory(data: any) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/invoiced/history?perPage=${perPage}&page=${page}${query}`);
  }

  public getInvoiceHistoryDetails(data: any) {
    return this.http.get(`/invoiced/history/details`, data);
  }

  public getInvoiceQueueDetails(data: any) {
    return this.http.get(`/invoiced/queue/details`, data);
  }

  public reSendInvoice(id: string) {
    return this.http.post(`/invoiced/run/queue`, { id });
  }

  public updateSettingGP(dataSettings: any) {
    return this.http.patch(`/settings-gp`, { dataSettings });
  }

  public removeSettingsGP(id: any) {
    return this.http.patch(`/settings-gp/remove`, { id });
  }

  // deliveries
  public getDeliveries(data: DeliveryPagination) {
    // const { perPage = 10, page = 0 } = data;
    // const query = this.getQuery(data);

    return this.http.get(`/deliveries`, data);
  }

  public getDeliveriesPrescriptionsCount(data: any) {
    return this.http.get('/deliveries/prescriptions', data);
  }

  public getDeliveriesBatches(data: DeliveryPagination) {
    const { perPage = 10, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/deliveries/batches-old?perPage=${perPage}&page=${page}${query}`);
  }

  public updateNameBatch(label: string, id: string) {
    return this.http.post(`/deliveries/batches/label`, { label, id });
  }

  public setDeliveriesToDispatch(ids: any) {
    return this.http.post(`/deliveries/to/dispatch`, { ids });
  }

  public getDeliveriesCourier(data: DeliveryPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/deliveries/courier?perPage=${perPage}&page=${page}${query}`);
  }

  public getDelivery(id: string) {
    return this.http.get(`/deliveries/${id}`);
  }

  public sendSignatureLink(deliveryId: string) {
    return this.http.post(`/deliveries/signature`, { deliveryId });
  }

  public getAdjustmentHistory(id: string) {
    return this.http.get(`/deliveries/adjustment-history/${id}`);
  }

  // orders
  public getOrders(params: OrderQueryParams) {
    const query = ''; // this.getOrdersQuery
    return this.http.get(`/deliveries/orders`, params);
  }

  public getOrder(id: string) {
    return this.http.get(`/deliveries/orders/${id}`);
  }

  public exportOrders(params: OrderQueryParams) {
    return this.http.get(`/deliveries/orders/export`, params);
  }

  // batches
  public getBatches(params: BatchQueryParams) {
    return this.http.get(`/deliveries/batches`, params);
  }

  public getBatch(id: string) {
    return this.http.get(`/deliveries/batches/${id}`);
  }

  // transactions
  public getTransactions(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/transactions?perPage=${perPage}&page=${page}${query}`);
  }

  // courier transactions list
  public getTransactionsList(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/dwolla-admin/transactions?perPage=${perPage}&page=${page}${query}`);
  }

  public getTransactionsByPharmacy(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/transactions/pharmacies?perPage=${perPage}&page=${page}${query}`);
  }

  public getTransactionsByGroup(data: TransactionPagination) {
    const { perPage, page = 0 } = data;
    const query = this.getQuery(data);

    return this.http.get(`/transactions/groups?perPage=${perPage}&page=${page}${query}`);
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

  public sendTaskToOnfleet(id: string) {
    return this.http.post(`/deliveries/set-onfleet`, { id });
  }

  public setForcedPrice(data: any) {
    return this.http.post(`/deliveries/force/price`, data);
  }

  public canceledOrder(id: string) {
    return this.http.post(`/admin/orders/cancel`, { id });
  }

  public failedOrder(id: string) {
    return this.http.post(`/admin/orders/fail`, { id });
  }

  public completedOrder(id: string) {
    return this.http.post(`/admin/orders/complete`, { id });
  }

  public forcedInvoicedOrder(id: string) {
    return this.http.post(`/admin/orders/forced/invoiced`, { id });
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

  // teams
  public getTeams() {
    return this.http.get(`/teams`);
  }

  public createPharmacyAdmin(data: Partial<PharmacyUser>) {
    return this.http.post(`/pharmacies/admin`, data);
  }

  public updatePharmacyAdmin(data: Partial<PharmacyUser>) {
    return this.http.put(`/pharmacies/admin`, data);
  }

  public removePharmacyAdmin(email: string) {
    return this.http.delete(`/pharmacies/admin/${email}`);
  }

  public pharmacyAdminForgotPassword(email: string) {
    return this.http.post(`/pharmacies/admin/forgot-password`, { email });
  }

  public pharmacyUserSetStatus(data: { user: string; status: PharmacyUserStatus }) {
    return this.http.post(`/pharmacies/admin/status`, data);
  }

  public courierForgotPassword(email: string) {
    return this.http.post(`/profile-guest/forgot-password`, { email });
  }

  public checkCreateCandidate(data: { cognitoId: string }) {
    return this.http.post('/checkr/candidate', data);
  }

  public changeCourierEmail(data: { _id: string; email: string }) {
    return this.http.post('/couriers/set-new-email', data);
  }

  public changeCourierPhone(data: { _id: string; phone: string }) {
    return this.http.post('/couriers/set-new-phone', data);
  }

  public courierSendReminder() {
    // return this.http.post('/couriers/registration-reminder-first');
    return this.http.post('/couriers/registration-reminder-second');
  }

  public logError(body: any) {
    return this.http.post(`/admin-log`, body);
  }

  public getAdminSettings(email: string) {
    return this.http.get(`/settings/admin?email=${email}`);
  }
}
