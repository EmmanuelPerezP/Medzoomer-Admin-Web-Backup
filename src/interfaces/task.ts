import { Delivery, Pharmacy, IOrder, TOrderStatuses, Consumer } from '.';
import { Coords } from '../components/common/MapDirection/types';

export interface Task {
  orderId?: IOrder['_id'];
  deliveryId?: string; // Delivery['_id']
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
