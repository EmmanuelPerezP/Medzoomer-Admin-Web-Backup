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
      rcFlatFeeForCourier: null,
      rcFlatFeeForPharmacy: null,
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
          isClosed: true
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
      signedAgreementUrl: '',
      groups: [],
      managers: {
        primaryContact: {
          firstName: '', // equal managerName
          lastName: '', // equal managerName
          phone: '', // equal managerPhoneNumber
          email: '' // equal email
        },
        secondaryContact: {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        }
      },
      affiliation: 'independent',
      expectedDeliveryRadius: '0-10',
      assistedLivingFacilitiesOrGroupHomes: {
        value: '',
        volume: ''
      },
      existingDrivers: {
        value: '',
        volume: ''
      },
      referrals: [
        {
          pharmacyName: '',
          managerName: '',
          contactInfo: ''
        }
      ],
      specialInstructions: '',
      isContactlessDelivery: '',
      controlledMedications: {
        value: '',
        specialRequirementsNote: '',
        signature: false,
        photoOfId: false,
        specialRequirements: false
      },
      reportedBackItems: {
        customerName: false,
        rxNumber: false,
        signature: false,
        date: false,
        medicationName: false,
        deliveryConfirmationPhotos: false
      },
      timeForCouriers: '',
      ordersSettings: {
        medicationDetails: false,
        rxCopay: false
      },
      isTemperatureRegulatedMedications: ''
    },
    newPharmacy: {
      group: '',
      hvDeliveries: 'No',
      affiliation: 'independent',
      hvPriceFirstDelivery: '',
      // hvPriceFollowingDeliveries: '',
      hvPriceHighVolumeDelivery: '',
      rcEnable: false,
      rcFlatFeeForCourier: null,
      rcFlatFeeForPharmacy: null,
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
          isClosed: true
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
      signedAgreementUrl: '',
      groups: [],
      managers: {
        primaryContact: {
          firstName: '', // equal managerName
          lastName: '', // equal managerName
          phone: '', // equal managerPhoneNumber
          email: '' // equal email
        },
        secondaryContact: {
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        }
      },
      expectedDeliveryRadius: '0-10',
      assistedLivingFacilitiesOrGroupHomes: {
        value: '',
        volume: ''
      },
      existingDrivers: {
        value: '',
        volume: ''
      },
      referrals: [
        {
          pharmacyName: '',
          managerName: '',
          contactInfo: ''
        }
      ],
      specialInstructions: '',
      isContactlessDelivery: '',
      controlledMedications: {
        value: '',
        specialRequirementsNote: '',
        signature: false,
        photoOfId: false,
        specialRequirements: false
      },
      reportedBackItems: {
        customerName: false,
        rxNumber: false,
        signature: false,
        date: false,
        medicationName: false,
        deliveryConfirmationPhotos: false
      },
      timeForCouriers: '',
      ordersSettings: {
        medicationDetails: false,
        rxCopay: false
      },
      isTemperatureRegulatedMedications: ''
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
