import api from '../../api';
import { TransactionsPagination } from '../../interfaces';

export const getTransactions = (data: TransactionsPagination) => {
  return api.getTransactionsList(data);
};
