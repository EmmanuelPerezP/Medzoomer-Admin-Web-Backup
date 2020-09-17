import { DeliveryState } from '../../interfaces';

export function initDelivery(): DeliveryState {
  return {
    deliveries: [],
    delivery: {
      order_uuid: '',
      createdAt: '',
      pharmacy: {
        group: '',
        billingAccount: '',
        pricePerDelivery: '',
        volumeOfferPerMonth: '',
        volumePrice: '',
        name: '',
        price: '',
        status: '',
        address: '',
        roughAddress: '',
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
        notes: '',
        status: '',
        _id: ''
      },
      preferDateTime: '',
      status: 'PENDING',
      totalDistance: 0,
      deliveryTime: 0,
      isCompleted: false,
      isPickedUp: false,
      isDroppedOff: false,
      eta: 0,
      notes: '',
      taskIds: []
    },
    filters: {
      sortField: '',
      page: 0,
      search: '',
      order: 'asc',
      status: 'ALL',
      assigned: 0,
      courier: '',
      pharmacy: '',
      startDate: '',
      endDate: ''
    },
    meta: { totalCount: 0, filteredCount: 0 }
  };
}
