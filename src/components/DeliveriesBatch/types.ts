import { IOrders } from '../../interfaces';

export interface IDeliveriesBatchConfiguration {
  perPage: number;
}

export interface GetOrdersResponse {
  data: IOrders;
  meta: {
    filteredCount: number;
  };
  status: 'Success';
}
