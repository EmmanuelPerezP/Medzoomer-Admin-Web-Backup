import { DeliveryState } from '../../interfaces';

export function initDelivery(): DeliveryState {
  return {
    deliveries: [],
    deliveriesDispatch: [],
    delivery: {
      order_uuid: '',
      createdAt: '',
      updatedAt: '',
      income: '',
      errorNotes: '',
      forcedPriceForPharmacy: '',
      forcedPriceForCourier: '',
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
        },
        signUpStep: ''
      },
      customer: {
        name: '',
        family_name: '',
        fullName: '',
        email: '',
        dob: '',
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
      order: {
        createdAt: '',
        customer: '',
        delivery: '',
        fromApi: false,
        group: '',
        order_uuid: 0,
        pharmacist: null,
        pharmacy: '',
        prescriptions: [],
        status: '',
        updatedAt: '',
        _id: ''
      },
      preferDateTime: '',
      status: 'PENDING',
      completionDetails: {},
      distToPharmacy: 0,
      deliveryTime: 0,
      isCompleted: false,
      isPickedUp: false,
      isDroppedOff: false,
      eta: 0,
      notes: '',
      taskIds: [],
      signatureUploadId: '',
      photoUploadIds: [],
      signature: ''
    },
    filters: {
      sortField: 'createdAt',
      page: 0,
      search: '',
      order: 'desc',
      status: 'ALL',
      assigned: 0,
      courier: '',
      pharmacy: '',
      startDate: '',
      endDate: '',
      isCopay: 'ALL'
    },
    defaultFilters: {
      sortField: 'createdAt',
      page: 0,
      search: '',
      order: 'desc',
      status: 'ALL',
      assigned: 0,
      courier: '',
      pharmacy: '',
      startDate: '',
      endDate: '',
      isCopay: 'ALL'
    },
    meta: { totalCount: 0, filteredCount: 0, totalFees: 0, bonus: 0 },
    activeTab: 'first'
  };
}
