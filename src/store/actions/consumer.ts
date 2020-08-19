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

export const updateConsumerStatus = (id: string, status: string) => {
  return api.updateConsumerStatus(id, status);
};

export const consumerSearchField = (field: string, search: string, limit: number) => {
  return api.consumerSearchField(field, search, limit);
};
