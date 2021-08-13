import React from 'react';

import courier from '../../../assets/icon/ill-admin-panel.svg';
import avatar from '../../../assets/icon/ico-login.svg';
import password from '../../../assets/icon/ico-pass.svg';
import passwordActive from '../../../assets/icon/ico-pass-active.svg';
import email from '../../../assets/icon/ico-email.svg';
import phone from '../../../assets/icon/ico-phone.svg';
import usaFlag from '../../../assets/icon/flag-usa.svg';
import upload from '../../../assets/icon/ico-upload.svg';
import location from '../../../assets/icon/ico-location.svg';
import calendar from '../../../assets/icon/ico-calendar.svg';
import doneNotes from '../../../assets/icon/ico-application.svg';
import checkEmail from '../../../assets/icon/ico-check-email.svg';
import backArrow from '../../../assets/icon/ico-back.svg';
import dashboard from '../../../assets/icon/ico-dashboard.svg';
import settings from '../../../assets/icon/ico-settings.svg';
import search from '../../../assets/icon/ico-search.svg';
import downArrow from '../../../assets/icon/ico-dropdown.svg';
import uploadPhoto from '../../../assets/icon/ico-upload-image.svg';
import passwordChanged from '../../../assets/icon/ico-password-changed.svg';
import courierIcon from '../../../assets/icon/ico-courier.svg';
import pharmacy from '../../../assets/icon/ico-pharmacy.svg';
import consumers from '../../../assets/icon/ico-consumers.svg';
import orders from '../../../assets/icon/ico-orders.svg';
import hide from '../../../assets/icon/ico-hide.svg';
import open from '../../../assets/icon/ico-open.svg';
import logout from '../../../assets/icon/ico-logout.svg';
import details from '../../../assets/icon/ico-details.svg';
import edit from '../../../assets/icon/ico-edit.svg';
import remove from '../../../assets/icon/ico-remove.svg';
import billing from '../../../assets/icon/ico-billing.svg';
import backArrow2 from '../../../assets/icon/ico-back-2.svg';
import successCreate from '../../../assets/icon/ico-success.svg';
import filters from '../../../assets/icon/ico-filters.svg';
import key from '../../../assets/icon/ico-key.svg';
import reset from '../../../assets/icon/ico-reset.svg';
import close from '../../../assets/icon/ico-close.svg';
import plus from '../../../assets/icon/ico-plus.svg';
import billingMenu from '../../../assets/icon/ico-billing-menu.svg';
import ordersDetail from '../../../assets/icon/ico-orders-detail.svg';
import teams from '../../../assets/icon/ico-teams.svg';
import notes from '../../../assets/icon/notes.svg';
import queue from '../../../assets/icon/ico-queue.svg';
import play from '../../../assets/icon/ico-play.svg';
import resendReport from '../../../assets/icon/ico-forward_to_inbox_black.svg';
import regenerateReport from '../../../assets/icon/ico-move_to_inbox_black.svg';
import warning from '../../../assets/icon/ico-warning.svg';
import groups from '../../../assets/icon/ico-groups.svg';
import income from '../../../assets/icon/ico-income.svg';
import transactions from '../../../assets/icon/ico-transactions.svg';
import invoicing from '../../../assets/icon/ico-invoicing.svg';
import queueInactive from '../../../assets/icon/ico-queue-inactive.svg';
import queueActive from '../../../assets/icon/ico-queue-active.svg';
import historyInactive from '../../../assets/icon/ico-history-inactive.svg';
import historyActive from '../../../assets/icon/ico-history-active.svg';
import pharmacyBilling from '../../../assets/icon/ico-pharmacy-billing.svg';
import delivery from '../../../assets/icon/ico-delivery.svg';
import order from '../../../assets/icon/ico-order.svg';
import customer from '../../../assets/icon/ico-customer.svg';
import medications from '../../../assets/icon/ico-medications.svg';
import pharmacyOrder from '../../../assets/icon/ico-pharmacy-order.svg';
import history from '../../../assets/icon/ico-history.svg';
import locationPin from '../../../assets/icon/ico-location-pin.svg';
import onfleetTasks from '../../../assets/icon/ico-onfleet-tasks.svg';
import customerDark from '../../../assets/icon/ico-customer-dark.svg';
import pharmacyDark from '../../../assets/icon/ico-pharmacy-dark.svg';
import refresh from '../../../assets/icon/ico-refresh.svg';
import update from '../../../assets/icon/ico-update.svg';
import checkmark from '../../../assets/icon/ico-checkmark.svg';

import { DestructByKey, IconProps } from '../../../interfaces';

const NAMES: DestructByKey<string> = {
  teams,
  transactions,
  billing,
  play,
  queue,
  ordersDetail,
  billingMenu,
  edit,
  courier,
  key,
  avatar,
  password,
  passwordActive,
  email,
  phone,
  usaFlag,
  upload,
  location,
  calendar,
  doneNotes,
  checkEmail,
  backArrow,
  dashboard,
  settings,
  search,
  downArrow,
  uploadPhoto,
  passwordChanged,
  courierIcon,
  pharmacy,
  consumers,
  backArrow2,
  orders,
  hide,
  open,
  logout,
  remove,
  details,
  successCreate,
  filters,
  reset,
  close,
  plus,
  notes,
  resendReport,
  regenerateReport,
  warning,
  groups,
  income,
  invoicing,
  queueInactive,
  queueActive,
  historyInactive,
  historyActive,
  pharmacyBilling,
  delivery,
  order,
  customer,
  medications,
  pharmacyOrder,
  history,
  locationPin,
  onfleetTasks,
  customerDark,
  pharmacyDark,
  refresh,
  update,
  checkmark
};

const SVGIcon = ({ name, className, style, onClick, ...rest }: IconProps) => {
  const src: string = NAMES[name];

  return (
    <img
      src={src}
      onClick={onClick}
      className={className}
      alt={'No Icon'}
      style={{ maxWidth: '100%', objectFit: 'scale-down', ...style }}
      {...rest}
    />
  );
};

export default SVGIcon;
