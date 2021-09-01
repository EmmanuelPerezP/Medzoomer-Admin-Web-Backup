import { Filters } from './helpers';
import { Delivery } from './delivery';

export type TransactionType = 'INCOME' | 'PAYOUT' | 'WITHDRAW' | 'FEE';
export type ReasonType = 'PAYOUT_DELIVERY' | 'PAYOUT_BONUS' | 'WITHDRAW_PAYOUT' | 'WITHDRAW_CLAWBACK'
  | 'WITHDRAW_BACKGROUND_CHECK_REPAYMENT' | 'WITHDRAW_PAID_OUTSIDE_SYSTEM';

export interface Transaction {
  amount: number;
  refunded: boolean;
  service: string;
  type: TransactionType;
  reason?: ReasonType;
  email: string;
  currencyCode: string;
  description: string;
  note?: string;
  delivery?: Delivery;
  updatedAt?: string;
}

export interface TransactionState {
  transactions: any[];
  pharmacyTransactions: any[];
  transaction: Transaction;
  filters: Filters;
  meta: {
    totalCount: number;
    filteredCount: number;
  };
  overview: {
    totalCount: number;
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
