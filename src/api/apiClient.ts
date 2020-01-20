import { HttpInterface } from './httpAdapter';

export default class ApiClient {
  constructor(protected http: HttpInterface) {}

  public setToken(token: string) {
    this.http.setBearerToken(token);
  }

  public getHealthCheck() {
    return this.http.get('/health-check');
  }
}
