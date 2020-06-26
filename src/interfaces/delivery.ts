import { FiltersDel } from './helpers';
import { Consumer } from './consumer';

export interface Delivery {
  order_uuid: string;
  preferDateTime: string;
  pharmacy: any;
  customer: Consumer;
  status: string;
  totalDistance: number;
  deliveryTime: number;
  isCompleted: boolean;
  isPickedUp: boolean;
  isDroppedOff: boolean;
  eta: number;
  notes: string;
  taskIds: any;
  createdAt: string;
}

export interface DeliveryState {
  deliveries: any[];
  delivery: Delivery;
  filters: FiltersDel;
  meta: { totalCount: number; filteredCount: number };
}

export interface DeliveryPagination {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  assigned?: string;
  sortField?: string;
  order?: string;
  period?: number;
  sub?: string;
  customerId?: string;
}
