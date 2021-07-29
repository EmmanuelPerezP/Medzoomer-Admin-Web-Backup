import { IOrders } from '../../interfaces';

export interface IOrdersConfiguration {
  perPage: number;
}

export interface GetOrdersResponse {
  data: IOrders;
  meta: {
    filteredCount: number;
  };
  status: 'Success';
}
