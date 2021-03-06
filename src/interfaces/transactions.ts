import { FiltersDel } from './helpers';
import { Consumer } from './consumer';
import { User } from './user';

export interface TransactionItem {
  order_uuid: string;
  income: string;
  forcedIncome?: boolean;
  preferDateTime: string;
  errorNotes: string;
  pharmacy: any;
  order: any;
  customer: Consumer;
  status: string;
  totalDistance: number;
  distToPharmacy: number;
  deliveryTime: number;
  isCompleted: boolean;
  isPickedUp: boolean;
  isDroppedOff: boolean;
  eta: number;
  notes: string;
  taskIds: any;
  createdAt: string;
  user?: User;
  signatureUploadId: string;
  photoUploadIds: string[];
}

export interface TransactionsState {
  transactions: any[];
  filters: FiltersDel;
  meta: { totalCount: number; filteredCount: number; totalFees: number; bonus: number };
}

export interface TransactionsPagination {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  assigned?: string;
  sortField?: string;
  order?: string;
  period?: number;
  sub?: string;
  courier?: string;
  pharmacy?: string;
  startDate?: any;
  endDate?: any;
  customerId?: string;
}
