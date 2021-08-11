import { IDefaultEntity } from '../components/InvoiceHistory/types';
import { Delivery } from './delivery';
import { ListItem } from './order';
import { Pharmacy } from './pharmacy';
import { User } from './user';

export type TBatchExtraStatuses = 'finished' | 'inprogress' | 'failed';

export interface IBatch extends IDefaultEntity {
  batch_uuid: number;
  dateDispatch: string; // ISO Date
  deliveries: Array<string | Delivery>;
  label: string;
  pharmacy: string | Pharmacy | undefined;
  pickupTask: string;
  mainUser?: string | User;
  users?: Array<string | User>;

  // not specific in model, but might be getting from calculation as extra fields
  $totalDistance?: string;
  $totalPrice?: string;
  $totalCopay?: string;
  $status?: TBatchExtraStatuses;
}

export interface IBatches extends Array<IBatch> {}

export type TBatchSortFields =
  | 'createdAt'
  | 'batch_uuid'
  | 'pharmacy.name'
  | 'mainUser.name'
  | 'totalDistance'
  | 'totalCopay'
  | 'totalPrice';

export interface BatchSpecificFilter {
  courier?: ListItem;
  pharmacy?: ListItem;
  startDate?: string;
  endDate?: string;
}

export interface BatchFilter extends BatchSpecificFilter {
  search?: string;
  page: number;
  sortField: TBatchSortFields;
  order: 'asc' | 'desc';
  perPage?: number;
}

export interface BatchState {
  batches: IBatches;
  batch: IBatch | null;
  filters: BatchFilter;
  defaultFilters: BatchFilter;
  meta: {
    filteredCount: number;
  };
}

export interface BatchQueryParams extends Omit<BatchSpecificFilter, 'pharmacy' | 'courier'> {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: string;
  order?: string;
  pharmacy?: string;
  courier?: string;
}
