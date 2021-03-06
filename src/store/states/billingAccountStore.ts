import { BillingState } from '../../interfaces';

export function initBillingAccountStore(): BillingState {
  return {
    billings: [],
    billing: {
      name: '',
      companyName: '',
      title: '',
      email: '',
      phone: ''
    },
    newBilling: {
      name: '',
      companyName: '',
      title: '',
      email: '',
      phone: ''
    },
    filters: {
      sortField: '',
      page: 0,
      search: '',
      order: 'asc'
    },
    billingAccountFilters: {
      page: 1,
      per_page: 50
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
