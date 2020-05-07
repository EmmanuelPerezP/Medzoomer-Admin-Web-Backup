import api from '../../api';
import { DeliveryPagination, Delivery } from '../../interfaces';

export const getDeliveries = (data: DeliveryPagination) => {
  return api.getDeliveries(data);
};

export const getDelivery = (id: string) => {
  return api.getDelivery(id);
};

