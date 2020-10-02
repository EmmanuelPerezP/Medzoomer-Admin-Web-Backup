import api from '../../api';
import { TransactionPagination } from '../../interfaces';

export const getTransactions = (data: TransactionPagination) => {
  return api.getTransactions(data);
};

export const getTransaction = (id: string) => {
  return api.getTransaction(id);
};

export const getTransactionsByPharmacy = (data: TransactionPagination) => {
  return api.getTransactionsByPharmacy(data);
};

export const getTransactionsByGroup = (data: TransactionPagination) => {
  return api.getTransactionsByGroup(data);
};
