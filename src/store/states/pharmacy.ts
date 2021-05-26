import { PharmacyState } from '../../interfaces';

export function initPharmacy(): PharmacyState {
  return {
    pharmacies: [],
    pharmacy: {
      hvDeliveries: '',
      hvPriceFirstDelivery: '',
      hvPriceFollowingDeliveries: '',
      hvPriceHighVolumeDelivery: '',
      rcEnable: false,
      group: '',
      billingAccount: '',
      pricePerDelivery: '',
      volumeOfferPerMonth: '',
      volumePrice: '',
      name: '',
      price: '',
      status: '',
      address: '',
      roughAddressObj: '',
      roughAddress: '',
      longitude: '',
      latitude: '',
      preview: '',
      agreement: { link: '', name: '', fileKey: '' },
      managerName: '',
      email: '',
      phone_number: '',
      managerPhoneNumber: '',
      schedule: {
        wholeWeek: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        monday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        tuesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        wednesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        thursday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        friday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        saturday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        sunday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        }
      },
      dayPlannedDeliveryCount: ''
    },
    newPharmacy: {
      group: '',
      hvDeliveries: '',
      hvPriceFirstDelivery: '',
      hvPriceFollowingDeliveries: '',
      hvPriceHighVolumeDelivery: '',
      rcEnable: false,
      billingAccount: '',
      pricePerDelivery: '',
      volumeOfferPerMonth: '',
      volumePrice: '',
      name: '',
      price: '',
      roughAddressObj: '',
      address: '',
      roughAddress: '',
      longitude: '',
      latitude: '',
      preview: '', // { link: '', key: '' },
      agreement: { link: '', name: '', fileKey: '' },
      managerName: '',
      email: '',
      status: '',
      phone_number: '',
      managerPhoneNumber: '',
      schedule: {
        wholeWeek: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        monday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        tuesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        wednesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        thursday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        friday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        saturday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        },
        sunday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: true
        }
      },
      dayPlannedDeliveryCount: ''
    },
    filters: {
      sortField: 'updatedAt',
      page: 0,
      search: '',
      order: 'desc'
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
