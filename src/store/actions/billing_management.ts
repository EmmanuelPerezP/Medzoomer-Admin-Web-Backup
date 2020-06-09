import api from '../../api';
import { BillingPagination, BillingAccounts } from '../../interfaces';

export const getBillings = (data: BillingPagination) => {
  return api.getBillings(data);
};

export const getAllBilling = () => {
  return api.getAllBillings();
};

export const getBilling = (id: string) => {
  return api.getBilling(id);
};

export const createBilling = (data: Partial<BillingAccounts>) => {
  return api.createBilling(data);
};

export const updateBilling = (id: string, data: Partial<BillingAccounts>) => {
  return api.updateBilling(id, data);
};

export const removeBilling = (id: string) => {
  return api.removeBilling(id);
};
