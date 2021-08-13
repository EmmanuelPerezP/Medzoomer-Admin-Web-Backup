import { BatchState } from '../../interfaces';

export function initBatch(): BatchState {
  return {
    batches: [],
    batch: null,
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
