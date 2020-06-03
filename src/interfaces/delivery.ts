import { Filters } from './helpers';
import { Consumer } from './consumer';

export interface Delivery {
  order_uuid: string;
  preferDateTime: string;
  customer: Consumer;
  status: string;
  totalDistance: number;
  deliveryTime: number;
  isCompleted: boolean;
  isPickedUp: boolean;
  isDroppedOff: boolean;
  eta: number;
  notes: string;
}

export interface DeliveryState {
  deliveries: any[];
  delivery: Delivery;
  filters: Filters;
  meta: { totalCount: number; filteredCount: number };
}

export interface DeliveryPagination {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  sortField?: string;
  order?: string;
  period?: number;
  sub?: string;
}
