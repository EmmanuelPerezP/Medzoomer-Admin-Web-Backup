import { TransactionsState } from '../../interfaces';

export function initTransactions(): TransactionsState {
  return {
    transactions: [],
    filters: {
      sortField: 'createdAt',
      page: 0,
      perPage: 20,
      order: 'desc',
      type: 'ALL',
      courier: '',
      startDate: '',
      endDate: ''
    },
    meta: { totalCount: 0, filteredCount: 0, totalFees: 0, bonus: 0 }
  };
}
