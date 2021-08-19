import { OrderState } from '../../interfaces';

export function initOrder(): OrderState {
  return {
    orders: [],
    order: null,
    meta: {
      filteredCount: 0
    },
    filters: {
      page: 0,
      sortField: 'createdAt',
      order: 'desc',
      search: '',
      perPage: 10
    },
    defaultFilters: {
      page: 0,
      sortField: 'createdAt',
      order: 'desc',
      search: '',
      perPage: 10
    }
  };
}
