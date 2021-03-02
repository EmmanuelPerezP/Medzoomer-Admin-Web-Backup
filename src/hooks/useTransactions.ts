import { useStores } from '../store';
import { DeliveryPagination } from '../interfaces';
import { getTransactions } from '../store/actions/transactions';

export default function useTransactions() {
  const { transactionsStore } = useStores();
  return {
    transactionsStore,
    ...transactionsStore.getState(),
    getTransactions: (data: DeliveryPagination) => getTransactions(data)
  };
}
