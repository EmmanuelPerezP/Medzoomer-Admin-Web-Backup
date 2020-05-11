import { Filters } from './helpers';

export type TransactionType = 'INCOME' | 'PAYOUT';

export interface Transaction {
  amount: number;
  refunded: boolean;
  service: string;
  type: TransactionType;
  email: string;
  currencyCode: string;
  description: string;
}

export interface TransactionState {
  transactions: any[];
  pharmacyTransactions: any[];
  transaction: Transaction;
  filters: Filters;
  meta: {
    totalCount: number;
    filteredCount: number;
    totalIncome: number;
    totalPayout: number;
  };
}

export interface TransactionPagination {
  page?: number;
  perPage?: number;
  search?: string;
  sortField?: string;
  order?: string;
  period?: number;
}
