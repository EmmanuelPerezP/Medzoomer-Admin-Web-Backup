import api from '../../api';
import { OrderQueryParams } from '../../interfaces';

export const getOrders = (params: OrderQueryParams) => {
  return api.getOrders(params);
};

export const getOrder = (id: string) => {
  return api.getOrder(id);
};

export const exportOrders = (params: OrderQueryParams) => {
  return api.exportOrders(params);
};
