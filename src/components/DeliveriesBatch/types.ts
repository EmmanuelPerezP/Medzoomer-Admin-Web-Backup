import { IBatches, IOrders } from '../../interfaces';

export interface IDeliveriesBatchConfiguration {
  perPage: number;
}

export interface GetDeliveriesBatchResponse {
  data: IBatches;
  meta: {
    filteredCount: number;
  };
  status: 'Success';
}

export type TDeliveryStatuses =
  | 'PENDING'
  | 'PROCESSED'
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELED'
  | 'FAILED';
