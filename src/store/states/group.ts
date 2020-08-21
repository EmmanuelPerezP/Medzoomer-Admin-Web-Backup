import { GroupState } from '../../interfaces';

export function initGroup(): GroupState {
  return {
    groups: [],
    group: {
      name: '',
      billingAccount: '',
      pricePerDelivery: null,
      volumeOfferPerMonth: null,
      volumePrice: null
    },
    newGroup: {
      name: '',
      billingAccount: '',
      pricePerDelivery: null,
      volumeOfferPerMonth: null,
      volumePrice: null
    },
    newContact: {
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING'
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
