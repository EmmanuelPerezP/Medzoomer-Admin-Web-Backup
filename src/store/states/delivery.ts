import { DeliveryState } from '../../interfaces';

export function initDelivery(): DeliveryState {
  return {
    deliveries: [],
    delivery: {
      order_uuid: '',
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
      preferDateTime: '',
      status: 'PENDING',
      totalDistance: 0,
      deliveryTime: 0,
      isCompleted: false,
      isPickedUp: false,
      isDroppedOff: false,
      eta: 0,
      notes: ''
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
