import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ApiError from './apiError';
import { logOut } from '../store/actions/auth';

export interface HttpParams {
  [name: string]: any;
}

export interface HttpInterface {
  setAuthorizationToken(token: string): void;

  get<T = any>(path: string, params?: HttpParams, config?: AxiosRequestConfig): Promise<T>;

  delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T>;

  post<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T>;

  put<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T>;

  patch<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T>;

  initErrorResponseInterceptor<T = any>(handler: (error: AxiosError) => Promise<T>): void;

  repeatRequest<T = any>(config: AxiosRequestConfig): Promise<T>;
}

export default class HttpAdapter implements HttpInterface {
  constructor(protected axiosInstance: AxiosInstance) {}

  protected SESSION_TIME = 1200000; // 20 minutes
  protected kickTimeOut: any;

  protected restartKickTimeOut = async () => {
    // console.log('start restart kick user')
    clearTimeout(this.kickTimeOut);
    this.kickTimeOut = setTimeout(async () => {
      // console.log('call log out!')
      await logOut();
    }, this.SESSION_TIME);
  };

  protected async processResponse<T>(promise: Promise<AxiosResponse<T>>, path: string): Promise<T> {
    if (sessionStorage.getItem('token')) {
      this.restartKickTimeOut().catch(console.error);
    }

    try {
      const { data } = await promise;
      return data;
    } catch (e) {
      throw new ApiError<T>(e, path);
    }
  }

  public initErrorResponseInterceptor<T = any>(handler: (error: AxiosError) => Promise<T>): void {
    this.axiosInstance.interceptors.response.use((response) => response, handler);
  }

  get axios(): AxiosInstance {
    return this.axiosInstance;
  }

  public setAuthorizationToken(token: string): void {
    if (!token) {
      delete this.axiosInstance.defaults.headers.Authorization;
    } else {
      this.axiosInstance.defaults.headers = {
        ...this.axiosInstance.defaults.headers,
        Authorization: token
      };
    }
  }

  public delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return this.processResponse(this.axios.delete<T>(path, config), path);
  }

  public get<T = any>(path: string, params?: HttpParams, config?: AxiosRequestConfig): Promise<T> {
    return this.processResponse(
      this.axios.get<T>(path, { ...config, params }),
      path
    );
  }

  public patch<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T> {
    return this.processResponse(this.axios.patch<T>(path, data, config), path);
  }

  public post<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T> {
    return this.processResponse(this.axios.post<T>(path, data, config), path);
  }

  public put<T = any>(path: string, data?: HttpParams, config?: AxiosRequestConfig): Promise<T> {
    return this.processResponse(this.axios.put<T>(path, data, config), path);
  }

  public repeatRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.axios(config) as any;
  }
}
