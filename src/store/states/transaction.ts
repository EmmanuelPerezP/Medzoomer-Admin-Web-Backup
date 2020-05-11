import { TransactionState } from '../../interfaces';

export function initTransaction(): TransactionState {
  return {
    transactions: [],
    pharmacyTransactions: [],
    transaction: {
      amount: 0,
      refunded: false,
      service: '',
      type: 'INCOME',
      email: '',
      currencyCode: '',
      description: ''
    },
    filters: {
      sortField: '',
      page: 0,
      search: '',
      order: 'asc'
    },
    meta: {
      totalCount: 0,
      filteredCount: 0,
      totalIncome: 0,
      totalPayout: 0
    }
  };
}
