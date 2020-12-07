import api from '../../api';
import { DeliveryPagination } from '../../interfaces';

export const getDeliveries = (data: DeliveryPagination) => {
  return api.getDeliveries(data);
};

export const getDelivery = (id: string) => {
  return api.getDelivery(id);
};

export const sendTaskToOnfleet = (id: string) => {
  return api.sendTaskToOnfleet(id);
};

export const canceledOrder = (id: string) => {
  return api.canceledOrder(id);
};

export const completedOrder = (id: string) => {
  return api.completedOrder(id);
};

export const getDeliveriesCourier = (data: DeliveryPagination) => {
  return api.getDeliveriesCourier(data);
};
