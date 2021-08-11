import { Coords } from '../components/common/MapDirection/types';
import { Consumer } from './consumer';
import { TOrderStatuses, IOrder } from './order';
import { Pharmacy } from './pharmacy';

export interface Task {
  orderId?: IOrder['_id'];
  order_uuid?: IOrder['order_uuid'];
  destinationType: 'pharmacy' | 'customer';
  isRC: boolean;
  deliveryDistance?: string;
  price?: number;
  rcPrice?: number;
  status: TOrderStatuses;
  destinationId?: Consumer['_id'] | Pharmacy['_id'];
  destinationAddress?: Consumer['address'];
  destinationName?: Consumer['fullName'] | Pharmacy['name'];
  point: Coords;
}
