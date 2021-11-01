import { GroupState } from '../../interfaces';

export function initGroup(): GroupState {
  return {
    groups: [],
    users: [],
    group: {
      name: '',
      settingsGP: ''
    },
    newGroup: {
      name: '',
      settingsGP: ''
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
