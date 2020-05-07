import { CustomerState } from '../../interfaces';
import { tableHeaders } from '../../constants';

export function initCustomer(): CustomerState {
  return {
    customers: [],
    customer: {
      name: '',
      family_name: '',
      fullName: '',
      email: '',
      phone: '',
      address: {
        apartment: '',
        state: '',
        postalCode: '',
        country: '',
        city: '',
        street: '',
        number: ''
      },
      latitude: '',
      longitude: '',
      billing_token: '',
      notes: ''
    },
    filters: {
      sortField: tableHeaders[2].value,
      page: 0,
      search: '',
      order: 'asc'
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
