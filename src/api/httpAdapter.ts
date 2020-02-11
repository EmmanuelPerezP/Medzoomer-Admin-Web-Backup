import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ApiError from './apiError';

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
}

export default class HttpAdapter implements HttpInterface {
  constructor(protected axiosInstance: AxiosInstance) {
    this.axiosInstance.defaults.headers = {
      ...this.axiosInstance.defaults.headers
    };
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          return Promise.all([localStorage.getItem('refresh'), localStorage.getItem('id')])
            .then((result) => {
              return this.axiosInstance.post('/profile-guest/refresh', {
                refreshToken: result[0],
                idToken: result[1]
              });
            })
            .then((res) => {
              this.axiosInstance.defaults.headers = {
                ...this.axiosInstance.defaults.headers,
                Authorization: res.data.AccessToken
              };
              const promises = [
                localStorage.setItem('token', res.data.AccessToken),
                localStorage.setItem('id', res.data.IdToken)
              ];
              if (res.data.RefreshToken) {
                promises.push(localStorage.setItem('refresh', res.data.RefreshToken));
              }
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: res.data.AccessToken
              };
              return Promise.all(promises);
            })
            .then(() => {
              return this.axiosInstance(originalRequest);
            });
        }
      }
    );
  }

  protected async processResponse<T>(promise: Promise<AxiosResponse<T>>, path: string): Promise<T> {
    try {
      const { data } = await promise;
      return data;
    } catch (e) {
      throw new ApiError<T>(e, path);
    }
  }

  get axios() {
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
}
