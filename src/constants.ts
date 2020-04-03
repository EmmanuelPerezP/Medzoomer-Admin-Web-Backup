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

export const filterCourier = [
  { value: 'ALL', label: 'All Couriers' },
  { value: 'REGISTERED', label: 'Registered' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'PENDING', label: 'Pending' }
];

export const menuItems = [
  { path: '/dashboard/overview', label: 'Dashboard', iconName: 'dashboard' },
  { path: '/dashboard/couriers', label: 'Courier Management', iconName: 'courierIcon' },
  { path: '/dashboard/pharmacies', label: 'Pharmacy Management', iconName: 'pharmacy' },
  { path: '/dashboard/consumers', label: 'Manage Consumers', iconName: 'consumers' },
  { path: '/dashboard/orders', label: 'Consumer Orders', iconName: 'orders' },
  { path: '/dashboard/settings', label: 'Settings', iconName: 'settings' }
];

export const settingsMenuItems = [
  { path: '/dashboard/settings/system', label: 'System settings' },
  { path: '/dashboard/settings/terms', label: 'Terms and Conditions' }
];

export const filterOverview = [
  { value: 30, label: 'Last 30 days' },
  { value: 7, label: 'Last 7 days' },
  { value: 1, label: 'Last day' }
];

export const Statuses: DestructByKey<string> = {
  ACTIVE: 'Active',
  DECLINED: 'Declined',
  PENDING: 'Pending',
  INCOMPLETE: 'Incomplete'
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
  pending: 'Pending',
  clear: 'Passed',
  consider: 'Passed',
  suspended: 'Failed',
  dispute: 'Failed'
};

export const tableHeaders = [
  { className: 'courier', value: 'name', label: 'Courier' },
  { className: 'registered', value: 'createdAt', label: 'Registered' },
  { className: 'updated', value: 'updatedAt', label: 'Updated' },
  { className: 'email', value: 'email', label: 'Email' },
  { className: 'phone', value: 'phone_number', label: 'Phone' },
  { className: 'checkrStatus', value: 'checkrStatus', label: 'Check Status' },
  { className: 'status', value: 'status', label: 'Status' },
  { className: 'actions', value: 'actions', label: 'Actions' }
];

export const emptyPharmacy = {
  name: '',
  price: '',
  address: '',
  longitude: '',
  latitude: '',
  preview: { link: '', key: '' },
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
};
