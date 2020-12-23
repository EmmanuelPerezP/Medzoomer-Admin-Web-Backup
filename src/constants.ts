import { DestructByKey } from './interfaces';

export const periodDays = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' }
];

export const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

export const filtersStatus = [
  // { value: 'ALL', label: 'All Couriers' },
  { value: 'REGISTERED', label: 'Complete' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'UNREGISTERED', label: 'Unregistered' },
  { value: 'ACTIVE', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PENDING', label: 'Pending' }
];

export const filtersDeliveriesStatus = [
  { value: 'ALL', label: 'All' },
  { value: 'PROCESSED', label: 'Processed' },
  { value: 'ACTIVE', label: 'Approved' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'UNASSIGNED', label: 'Unassigned' },
  { value: 'COMPLETED', label: 'Complete' },
  { value: 'PENDING', label: 'Pending' }
];

export const filtersDeliveriesAssigned = [
  { value: '0', label: 'All' },
  { value: '1', label: 'Assigned' },
  { value: '-1', label: 'Unassigned' }
];

export const filtersGender = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' }
];

// Transform to boolean via compare ==='true'
export const filtersBoolean = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' }
];

export const filtersCheckrStatus = [
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'pending', label: 'Pending' },
  { value: 'clear', label: 'Passed' },
  { value: 'consider', label: 'Consider' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'dispute', label: 'Dispute' }
];

export const menuItems = [
  { path: '/dashboard/overview', label: 'Dashboard', iconName: 'dashboard' },
  { path: '/dashboard/couriers', label: 'Courier Management', iconName: 'courierIcon' },
  { path: '/dashboard/pharmacies', label: 'Pharmacy Management', iconName: 'pharmacy' },
  { path: '/dashboard/groups', label: 'Group Management', iconName: 'orders' },
  // { path: '/dashboard/billing_management', label: 'Billing Accounts', iconName: 'billingMenu' },
  { path: '/dashboard/income', label: 'Income', iconName: 'orders' },
  { path: '/dashboard/consumers', label: 'Consumer Management', iconName: 'consumers' },
  { path: '/dashboard/orders', label: 'Order Management', iconName: 'orders' },
  { path: '/dashboard/teams', label: 'Teams', iconName: 'teams' },
  { path: '/dashboard/settings', label: 'Settings', iconName: 'settings' }
];

export const settingsMenuItems = [
  { path: '/dashboard/settings/system', label: 'System settings' },
  { path: '/dashboard/settings/map', label: 'OnFleet Teams Map Settings' },
  { path: '/dashboard/settings/terms', label: 'Terms and Conditions' }
];

export const filterOverview = [
  { value: 30, label: 'Last 30 days' },
  { value: 7, label: 'Last 7 days' },
  { value: 1, label: 'Last day' }
];

export const filterOverviewWithAll = [
  { value: 30, label: 'Last 30 days' },
  { value: 7, label: 'Last 7 days' },
  { value: 1, label: 'Last day' },
  { value: 0, label: 'All' }
];

export const Statuses: DestructByKey<string> = {
  ACTIVE: 'Approved',
  DECLINED: 'Declined',
  PENDING: 'Pending',
  INCOMPLETE: 'Incomplete',
  UNREGISTERED: 'Unregistered',
  COMPLETED: 'Completed'
};

export const ConsumerStatuses: DestructByKey<string> = {
  ACTIVE: 'Active',
  LOCKED: 'Locked'
};

export const DeliveryStatuses: DestructByKey<string> = {
  PENDING: 'Pending',
  UNASSIGNED: 'Not Assigned',
  ASSIGNED: 'Assigned',
  ACTIVE: 'Active',
  PROCESSED: 'Processed',
  COMPLETED: 'Completed',
  SUSPICIOUS: 'Suspicious',
  CANCELED: 'Canceled'
};

export const tShirtSizes: DestructByKey<string> = {
  XS: 'Extra small',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra large',
  XXL: 'Extra extra large'
};

export const CheckRStatuses: DestructByKey<string> = {
  incomplete: 'Incomplete',
  unregistered: 'Unregistered',
  pending: 'Pending',
  clear: 'Passed',
  consider: 'Consider',
  suspended: 'Suspended',
  dispute: 'Dispute'
};

export const tableHeaders = [
  { className: 'courier', value: 'name', label: 'Courier' },
  { className: 'registered', value: 'createdAt', label: 'Registered' },
  { className: 'updated', value: 'updatedAt', label: 'Updated' },
  { className: 'city', value: 'city', label: 'City' },
  { className: 'state', value: 'state', label: 'State' },
  { className: 'zipCode', value: 'zipCode', label: 'Zip Code' },
  // { className: 'email', value: 'email', label: 'Email' },
  // { className: 'phone', value: 'phone_number', label: 'Phone' },
  { className: 'checkrStatus', value: 'checkrStatus', label: 'CheckR Status' },
  { className: 'status', value: 'status', label: 'Registration Status' },
  { className: 'status', value: 'onboarded', label: 'Onboarding Status' },
  { className: 'actions', value: 'actions', label: 'Actions' }
];

export const emptyPharmacy = {
  name: '',
  group: '',
  roughAddress: '',
  billingAccount: '',
  pricePerDelivery: '',
  volumeOfferPerMonth: '',
  volumePrice: '',
  price: '',
  address: '',
  longitude: '',
  latitude: '',
  preview: '',
  agreement: { link: '', name: '', fileKey: '' },
  managerName: '',
  email: '',
  phone_number: '',
  status: '',
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
};

export const SETTINGS = {
  TERMS: 'terms',
  COURIER_COMMISSION_DELIVERY: 'delivery',
  GROUP_MAP: 'map',
  COURIER_COMMISSION_TIPS: 'tips',
  COURIER_TRANSACTION_FEE: 'transaction_fee',
  TRAINING_VIDEO_LINK: 'training_video_link'
};

export const settingsError: DestructByKey<string> = {
  delivery: 'Delivery',
  tips: 'Tips',
  training_video_link: 'Link'
};

export const PHARMACY_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  DECLINED: 'declined'
};

export const DELIVERY_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  DECLINED: 'DECLINED',
  COMPLETED: 'COMPLETED',
  PROCESSED: 'PROCESSED',
  CANCELED: 'CANCELED'
};

export const contactTypesArray = [
  { value: 'BILLING-ACCOUNT', label: 'Billing Account Holder (Primary)' },
  { value: 'BILLING', label: 'Receives Invoices (Secondary)' },
  { value: 'REPORTING', label: 'Receives Reports (Secondary)' },
  { value: 'BILLING-REPORTING', label: 'Receives Invoices & Reports (Secondary)' }
];

export const contactTypes: DestructByKey<string> = {
  REPORTING: 'Receives Reports (Secondary)',
  BILLING: 'Receives Invoices (Secondary)',
  'BILLING-REPORTING': 'Receives Invoices & Reports (Secondary)',
  'BILLING-ACCOUNT': 'Billing Account Holder (Primary)'
};
