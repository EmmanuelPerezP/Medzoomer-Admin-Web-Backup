import { GroupState } from '../../interfaces';

export function initGroup(): GroupState {
  return {
    groups: [],
    group: {
      name: '',
      billingAccount: '',
      forcedPrice: 0,
      prices: [
        {
          orderCount: '0-10000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '10001-25000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '25001-10000000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        }
      ]
    },
    newGroup: {
      name: '',
      billingAccount: '',
      forcedPrice: 0,
      prices: [
        {
          orderCount: '0-10000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '10001-25000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        },
        {
          orderCount: '25001-10000000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: 0
            },
            {
              minDist: 5,
              maxDist: 10,
              price: 0
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: 0
            }
          ]
        }
      ]
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
