import { Pharmacy, PharmacyReport } from './pharmacy';
import { PharmacyUser, User } from './user';

import { Consumer } from './consumer';
import { Delivery } from './delivery';
import { Group } from './group';
import { IBatch } from './batch';
import { IDefaultEntity } from '../components/InvoiceHistory/types';

export interface ListItem {
  value: string;
  label: string;
  _id?: string;
}
export interface Prescriptions {
  name: string;
  dose: string;
  quantity: number;
  rxNumber: number | null;
  rxFillDate: string | null;
  rxCopay: number | null;
  _id?: string;
  numberOfRefills?: string;
  refillUntil?: string;
}

export interface ExpandedPrescriptions extends Prescriptions {
  order_uuid: number;
  orderId: string;
}

export interface IPrescriptionsArray extends Array<Prescriptions> {}

export type TOrderStatuses = 'new' | 'ready' | 'canceled' | 'pending' | 'route' | 'delivered' | 'failed' | 'all';
export interface IOrder extends IDefaultEntity {
  order_uuid: number;
  customer: string | Consumer;
  pharmacy: string | Pharmacy;
  delivery: string | Delivery;
  group: string | Group;
  pharmacist: string | PharmacyUser;
  pharmacyReportId: string | PharmacyReport;
  distToCustomer: string;
  priceForDelivery: number;
  prescriptions: IPrescriptionsArray;
  status: TOrderStatuses;
  dispatchAt: string; // ISO date
  fromApi: boolean;
  notes: string;
  returnCash: boolean;
  isContactlessDelivery: boolean;
  canPackageBeLeft: boolean;
  $batch?: IBatch | null; // not specific in model, but might be getting from backend as extra field
  batch_uuid?: number;
  $statusHistory?: any;
}

export interface IOrders extends Array<IOrder> {}

export type TOrderSortFields = 'createdAt' | 'order_uuid' | 'pharmacy.name' | 'dispatchAt' | 'status';

export interface OrderSpecificFilter {
  status?: TOrderStatuses;
  pharmacy?: ListItem;
  startDate?: string;
  endDate?: string;
}
export interface OrderFilter extends OrderSpecificFilter {
  search?: string;
  page: number;
  sortField: TOrderSortFields;
  order: 'asc' | 'desc';
  perPage?: number;
}

export interface OrderState {
  orders: IOrders;
  order: IOrder | null;
  filters: OrderFilter;
  defaultFilters: OrderFilter;
  meta: {
    filteredCount: number;
  };
}

export interface OrderQueryParams extends Omit<OrderSpecificFilter, 'pharmacy'> {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: string;
  order?: string;
  pharmacy?: string;
}

export interface PriceHistory extends IDefaultEntity {
  prevValue: string;
  nextValue: string;
  adjustedType: 'pharmacy' | 'courier';
  adjustedFor: string | Delivery;
  adjustedBy: string | User;
}

export interface PriceHistories extends Array<PriceHistory> {}
