import { DestructByKey } from './interfaces';
import Typography from '@material-ui/core/Typography';
import React from 'react';

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
  { value: 'ALL', label: 'Registered' },
  { value: 'REGISTERED', label: 'Complete' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'UNREGISTERED', label: 'Unregistered' },
  { value: 'ACTIVE', label: 'Approved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PENDING', label: 'Pending' }
];

export const registrationFilterStatuses = [
  { value: 'UNREGISTERED', label: 'Unregistered' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REGISTERED', label: 'Registered' }
];

export const onboardingFilterStatuses = [
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DENIED', label: 'Denied' }
];

export const filtersDeliveriesStatus = [
  { value: 'ALL', label: 'All' },
  { value: 'PROCESSED', label: 'Processed' },
  { value: 'ACTIVE', label: 'Approved' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'UNASSIGNED', label: 'Unassigned' },
  { value: 'COMPLETED', label: 'Complete' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' }
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
  { value: 'notSent', label: 'ChechR link is not sent' },
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

export const invoiceFrequency = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi_monthly', label: 'Bi-Monthly (1/15th)' },
  { value: 'bi_weekly', label: 'Bi-Weekly (every two weeks)' },
  { value: 'weekly', label: 'Weekly' }
];

export const invoiceFrequencyWeeklyDays = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
];
export const invoiceFrequencyMonthlyDays = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  { value: 24, label: '24' },
  { value: 25, label: '25' },
  { value: 26, label: '26' },
  { value: 27, label: '27' },
  { value: 28, label: '28' },
  { value: 29, label: '29' },
  { value: 30, label: '30' },
  { value: 31, label: '31' }
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
  CANCELED: 'Canceled',
  FAILED: 'Failed'
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
  COURIER_COST_FOR_ONE_ORDER: 'courier_cost_for_one_order',
  COURIER_COST_FOR_TWO_ORDER: 'courier_cost_for_two_order',
  COURIER_COST_FOR_MORE_TWO_ORDER: 'courier_cost_for_more_two_order',
  COURIER_COST_FOR_ML_IN_DELIVERY: 'courier_cost_for_ml_in_delivery',
  TRAINING_VIDEO_LINK: 'training_video_link'
};

export const settingsError: DestructByKey<string> = {
  delivery: 'Delivery',
  tips: 'Tips',
  training_video_link: 'Link',
  courier_cost_for_one_order: 'Order in Delivery',
  courier_cost_for_two_order: '2 Orders in Delivery',
  courier_cost_for_more_two_order: '3 or More Orders in Delivery',
  courier_cost_for_ml_in_delivery: '10+ Mile Delivery'
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
  CANCELED: 'CANCELED',
  FAILED: 'FAILED'
};

export const contactTypesArray = [
  { value: 'BILLING-ACCOUNT', label: 'Billing Account Holder (Primary)' },
  { value: 'BILLING', label: 'Receives Invoices (Secondary)' },
  { value: 'REPORTING', label: 'Receives Reports (Secondary)' },
  { value: 'BILLING-REPORTING', label: 'Receives Invoices & Reports (Secondary)' },
  { value: 'GROUP-MANAGER', label: 'Group Manager' }
];

export const contactTypes: DestructByKey<string> = {
  REPORTING: 'Receives Reports (Secondary)',
  BILLING: 'Receives Invoices (Secondary)',
  'BILLING-REPORTING': 'Receives Invoices & Reports (Secondary)',
  'BILLING-ACCOUNT': 'Billing Account Holder (Primary)',
  'GROUP-MANAGER': 'Group Manager'
};

export const URL_TO_ONFLEET_SIGNATURE = process.env.URL_TO_ONFLEET_SIGNATURE
  ? process.env.URL_TO_ONFLEET_SIGNATURE
  : 'https://d15p8tr8p0vffz.cloudfront.net';
