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
import add from '../../../assets/icon/ico-add.svg';
import consumers from '../../../assets/icon/ico-consumers.svg';
import orders from '../../../assets/icon/ico-orders.svg';
import hide from '../../../assets/icon/ico-hide.svg';
import logout from '../../../assets/icon/ico-logout.svg';
import details from '../../../assets/icon/ico-details.svg';

import { DestructByKey, IconProps } from '../../../interfaces';

const NAMES: DestructByKey<string> = {
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
  add,
  consumers,
  orders,
  hide,
  logout,
  details
};

const SVGIcon = ({ name, className, style, ...rest }: IconProps) => {
  const src: string = NAMES[name];
  return (
    <img src={src} className={className} style={{ maxWidth: '100%', objectFit: 'scale-down', ...style }} {...rest} />
  );
};

export default SVGIcon;
