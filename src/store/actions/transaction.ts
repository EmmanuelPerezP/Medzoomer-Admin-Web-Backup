import api from '../../api';
import { TransactionPagination, Transaction } from '../../interfaces';

export const getTransactions = (data: TransactionPagination) => {
  return api.getTransactions(data);
};

export const getTransaction = (id: string) => {
  return api.getTransaction(id);
};

export const getTransactionsByPharmacy = (data: TransactionPagination) => {
  return api.getTransactionsByPharmacy(data);
};
