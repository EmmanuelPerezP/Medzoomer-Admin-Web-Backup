import api from '../../api';
import { ConsumerPagination, Consumer } from '../../interfaces';

export const getConsumers = (data: ConsumerPagination) => {
  return api.getConsumers(data);
};

export const getConsumer = (id: string) => {
  return api.getConsumer(id);
};

export const createConsumer = (data: Partial<Consumer>) => {
  return api.createConsumer(data);
};

export const updateConsumer = (id: string, data: Partial<Consumer>) => {
  return api.updateConsumer(id, data);
};
