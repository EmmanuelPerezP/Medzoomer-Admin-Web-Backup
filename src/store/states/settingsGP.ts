import { SettingsGPState } from '../../interfaces';

export function initSettingsGP(): SettingsGPState {
  return {
    listSettingsGP: [],
    billingAccountHolderHistory: [],
    settingsGP: {
      name: '',
      billingAccount: '',
      invoicedId: null,
      billingAccountHolder: {
        attention_to: '',
        name: '',
        companyName: '',
        email: '',
        phone: ''
      },
      invoiceFrequency: 'bi_monthly',
      invoiceFrequencyInfo: 1,
      amountOrdersInBatch: -1,
      forcedPrice: null,
      isManualBatchDeliveries: 'No',
      calculateDistanceForSegments: 'Yes',
      autoDispatchTimeframe: '180',
      dispatchedBeforeClosingHours: '120',
      maxDeliveryLegDistance: '10',
      prices: [
        {
          orderCount: '0-10000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
            }
          ]
        },
        {
          orderCount: '10001-25000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
            }
          ]
        },
        {
          orderCount: '25001-10000000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
            }
          ]
        }
      ]
    },
    newSettingsGP: {
      name: '',
      invoiceFrequency: 'bi_monthly',
      invoicedId: null,
      billingAccountHolder: {
        attention_to: '',
        name: '',
        companyName: '',
        email: '',
        phone: ''
      },
      invoiceFrequencyInfo: 1,
      amountOrdersInBatch: -1,
      billingAccount: '',
      isManualBatchDeliveries: 'No',
      calculateDistanceForSegments: 'Yes',
      autoDispatchTimeframe: '180',
      dispatchedBeforeClosingHours: '120',
      maxDeliveryLegDistance: '10',
      forcedPrice: null,
      prices: [
        {
          orderCount: '0-10000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
            }
          ]
        },
        {
          orderCount: '10001-25000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
            }
          ]
        },
        {
          orderCount: '25001-10000000',
          prices: [
            {
              minDist: 0,
              maxDist: 5,
              price: null
            },
            {
              minDist: 5,
              maxDist: 10,
              price: null
            },
            {
              minDist: 10,
              maxDist: 1000,
              price: null
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
    billingAccountFilters: {
      page: 1,
      per_page: 50
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
