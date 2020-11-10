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

export const getDeliveriesCourier = (data: DeliveryPagination) => {
  return api.getDeliveriesCourier(data);
};
