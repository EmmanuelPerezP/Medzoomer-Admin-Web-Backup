import { PharmacyState } from '../../interfaces';

export function initPharmacy(): PharmacyState {
  return {
    pharmacies: [],
    pharmacy: {
      group: '',
      name: '',
      price: '',
      status: '',
      address: '',
      longitude: '',
      latitude: '',
      preview: '',
      agreement: { link: '', name: '', fileKey: '' },
      managerName: '',
      email: '',
      phone_number: '',
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
      }
    },
    newPharmacy: {
      group: '',
      name: '',
      price: '',
      address: '',
      longitude: '',
      latitude: '',
      preview: '', // { link: '', key: '' },
      agreement: { link: '', name: '', fileKey: '' },
      managerName: '',
      email: '',
      status: '',
      phone_number: '',
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
      }
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
