import { PharmacyState } from '../../interfaces';

export function initPharmacy(): PharmacyState {
  return {
    pharmacies: [],
    pharmacy: {
      hvDeliveries: '',
      hvPriceFirstDelivery: '',
      // hvPriceFollowingDeliveries: '',
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
          isClosed: false
        },
        tuesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        wednesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        thursday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        friday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        saturday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        sunday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        }
      },
      dayPlannedDeliveryCount: '',
      signedAgreementUrl: ''
    },
    newPharmacy: {
      group: '',
      hvDeliveries: 'No',
      affiliation: 'group',
      hvPriceFirstDelivery: '',
      // hvPriceFollowingDeliveries: '',
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
          isClosed: false
        },
        tuesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        wednesday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        thursday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        friday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        saturday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        },
        sunday: {
          open: { hour: '', minutes: '', period: 'AM' },
          close: { hour: '', minutes: '', period: 'AM' },
          isClosed: false
        }
      },
      dayPlannedDeliveryCount: '',
      signedAgreementUrl: ''
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
