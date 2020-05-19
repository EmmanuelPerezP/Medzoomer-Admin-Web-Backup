import { GroupState } from '../../interfaces';

export function initGroup(): GroupState {
  return {
    groups: [],
    group: {
      name: '',
      fee: '',
      policy: ''
    },
    filters: {
      sortField: '',
      page: 0,
      search: '',
      order: 'asc'
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
