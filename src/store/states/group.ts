import { GroupState } from '../../interfaces';

export function initGroup(): GroupState {
  return {
    groups: [],
    group: {
      name: '',
      bellingAccounts: '',
      pricePerDelivery: null,
      volumeOfferPerMonth: null,
      volumePrice: null
    },
    newGroup: {
      name: '',
      bellingAccounts: '',
      pricePerDelivery: null,
      volumeOfferPerMonth: null,
      volumePrice: null
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
