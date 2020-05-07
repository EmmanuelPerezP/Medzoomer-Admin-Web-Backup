import api from '../../api';
import { CustomerPagination, Customer } from '../../interfaces';

export const getCustomers = (data: CustomerPagination) => {
  return api.getCustomers(data);
};

export const getCustomer = (id: string) => {
  return api.getCustomer(id);
};

export const createCustomer = (data: Partial<Customer>) => {
  return api.createCustomer(data);
};

export const updateCustomer = (id: string, data: Partial<Customer>) => {
  return api.updateCustomer(id, data);
};