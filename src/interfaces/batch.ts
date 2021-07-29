import { IDefaultEntity } from '../components/InvoiceHistory/types';
import { Delivery } from './delivery';
import { Pharmacy } from './pharmacy';

export interface IBatch extends IDefaultEntity {
  batch_uuid: number;
  dateDispatch: string; // ISO Date
  deliveries: Array<string | Delivery>;
  label: string;
  pharmacy: string | Pharmacy | undefined;
  pickupTask: string;
}
