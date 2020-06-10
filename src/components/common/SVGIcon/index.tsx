import React from 'react';

import courier from '../../../assets/icon/ill-admin-panel.svg';
import avatar from '../../../assets/icon/ico-login.svg';
import password from '../../../assets/icon/ico-pass.svg';
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
import reset from '../../../assets/icon/ico-reset.svg';
import close from '../../../assets/icon/ico-close.svg';
import plus from '../../../assets/icon/ico-plus.svg';

import { DestructByKey, IconProps } from '../../../interfaces';

const NAMES: DestructByKey<string> = {
  billing,
  edit,
  courier,
  avatar,
  password,
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
  plus
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
