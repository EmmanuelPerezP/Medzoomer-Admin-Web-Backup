import { FiltersDel } from './helpers';
import { Consumer } from './consumer';
import { User } from './user';
import { Transaction } from './transaction';

export interface Delivery {
  order_uuid: string;
  income: string;
  forcedIncome?: boolean;
  preferDateTime: string;
  errorNotes: string;
  pharmacy: any;
  forcedPriceForPharmacy: string;
  forcedPriceForCourier: string;
  order: any;
  customer: Consumer;
  status: string;
  completionDetails?: ICompletionDetils;
  distToPharmacy: number;
  deliveryTime: number;
  deliveryDist?: number;
  isCompleted: boolean;
  isPickedUp: boolean;
  isDroppedOff: boolean;
  eta: number;
  notes: string;
  taskIds: any;
  createdAt: string;
  user?: User;
  type?: 'TO_CUSTOMER' | 'RETURN_CASH';
  signatureUploadId: string;
  photoUploadIds: string[];
  signature: string;
  payout?: Transaction;
}

export interface DeliveryState {
  deliveries: any[];
  deliveriesDispatch: any[];
  delivery: Delivery;
  filters: FiltersDel;
  defaultFilters: FiltersDel;
  meta: { totalCount: number; filteredCount: number; totalFees: number; bonus: number };
  activeTab: string;
}

export interface DeliveryPagination {
  allWithCountPrescriptions?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  assigned?: string;
  sortField?: string;
  order?: string;
  needNotShowBadStatus?: number;
  period?: number;
  batches?: number;
  sub?: string;
  courier?: string;
  pharmacy?: string;
  startDate?: any;
  endDate?: any;
  customerId?: string;
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

export type TLocation = [number, number];

export interface CompletionEvent {
  name: 'start' | 'arrival' | 'departure';
  time: number;
  location?: TLocation;
}

export interface ICompletionDetils
  extends Partial<{
    actions: any[];
    events: CompletionEvent[];
    distance: string;
    failureNotes: string;
    failureReason: 'NONE' | string;
    firstLocation: TLocation;
    lastLocation: TLocation;
    notes: string;
    photoUploadId: string;
    photoUploadIds: string[];
    signatureText: string;
    signatureUploadId: string;
    success: boolean;
    time: number;
    unavailableAttachments: any[];
  }> {}
