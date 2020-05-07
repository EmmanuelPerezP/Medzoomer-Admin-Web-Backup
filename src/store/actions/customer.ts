import api from '../../api';
import { CustomerPagination } from '../../interfaces';

export const getCustomers = (data: CustomerPagination) => {
  return api.getCustomers(data);
};

export const getCustomer = (id: string) => {
  return api.getCustomer(id);
};
