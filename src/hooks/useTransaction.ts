import { useStores } from '../store';
import { TransactionPagination } from '../interfaces';
import { getTransactions, getTransaction, getTransactionsByPharmacy } from '../store/actions/transaction';

export default function useTransaction() {
  const { transactionStore } = useStores();

  return {
    ...transactionStore.getState(),
    getTransaction: (id: string) => getTransaction(id),
    getTransactionsByPharmacy: (data: TransactionPagination) => getTransactionsByPharmacy(data),
    getTransactions: (data: TransactionPagination) => getTransactions(data)
  };
}
