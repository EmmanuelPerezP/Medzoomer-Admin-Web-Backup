import { SettingsGPState } from '../../interfaces';

export function initSettingsGP(): SettingsGPState {
  return {
    listSettingsGP: [],
    billingAccountHolderHistory: [],
    settingsGP: {
      name: '',
      billingAccount: '',
      invoiceFrequency: 'bi_monthly',
      reporting: 'one_page_per_costumer',
      pickUpTimes: {},
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
      forcedPrice: null,
      isManualBatchDeliveries: 'No',
      calculateDistanceForSegments: 'Yes',
      autoDispatchTimeframe: '180',
      dispatchedBeforeClosingHours: '120',
      maxDeliveryLegDistance: '10',
      allowHighVolumeDeliveries: false,
      enablePriceProjection: false,
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
      ],
      highVolumePrices: [
        {
          orderCount: '50-100',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
        {
          orderCount: '100-N',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
      ],
      standardPrices: [
        {
          orderCount: '0-25',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
        {
          orderCount: '25-N',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
      ],
      failedDeliveryCharge: null
    },
    newSettingsGP: {
      name: '',
      invoiceFrequency: 'bi_monthly',
      reporting: 'one_page_per_costumer',
      pickUpTimes: {},
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
      allowHighVolumeDeliveries: false,
      enablePriceProjection: false,
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
      ],
      highVolumePrices: [
        {
          orderCount: '50-100',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
        {
          orderCount: '100-N',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
      ],
      standardPrices: [
        {
          orderCount: '0-25',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
        {
          orderCount: '25-N',
          prices: [
            {
              minDist: 0,
              maxDist: 25,
              price: null
            },
            {
              minDist: 25,
              maxDist: 50,
              price: null
            },
          ]
        },
      ],
      failedDeliveryCharge: null
    },
    newContact: {
      fullName: '',
      email: '',
      companyName: '',
      title: '',
      phone: '',
      type: 'BILLING',
      attachedToCustomerId: null
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
