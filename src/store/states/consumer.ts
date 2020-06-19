import { ConsumerState } from '../../interfaces';
import { tableHeaders } from '../../constants';

export function initConsumer(): ConsumerState {
  return {
    consumers: [],
    consumer: {
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
      status: '',
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
