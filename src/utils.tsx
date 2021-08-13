import React from 'react';
import moment from 'moment-timezone';
import { CourierUser, ErrorInterface, User } from './interfaces';
import { days, startOfTheWorkDay, endOfTheWorkDay, PHONE_COUNTRY_CODE, emptyPharmacy } from './constants';

// ! TODO - remove it after complete new deliveries & orders changes
export const canShowNewDeliveries = window.location.host.includes('admin.dev.medzoomer.com') || window.location.host.includes('localhost');

export const decodeErrors = (errors: ErrorInterface[]) => {
  return Array.from(errors || []).reduce((res: object, e: ErrorInterface) => {
    return { ...res, [e.field[0]]: e.messages[0] };
  }, {});
};
export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.toLowerCase().slice(1);
};
export const changeScheduleSplit = (isSplitByDay: boolean, schedule: any) => {
  if (isSplitByDay) {
    days.forEach((day) => {
      schedule[day.value].isClosed = false;
    });
    schedule.wholeWeek.isClosed = true;
  } else {
    days.forEach((day) => {
      schedule[day.value].isClosed = true;
    });
    schedule.wholeWeek.isClosed = false;
  }
};

const setTimeFromOldLogic = (schedule: any) => {
  const newSchedule = Object.assign({}, schedule);

  days.forEach((day) => {
    newSchedule[day.value].close.hour = schedule.wholeWeek.close.hour;
    newSchedule[day.value].close.minutes = schedule.wholeWeek.close.minutes;
    newSchedule[day.value].close.period = schedule.wholeWeek.close.period;
    newSchedule[day.value].open.hour = schedule.wholeWeek.open.hour;
    newSchedule[day.value].open.minutes = schedule.wholeWeek.open.minutes;
    newSchedule[day.value].open.period = schedule.wholeWeek.open.period;
    newSchedule[day.value].isClosed = false;
  });
  newSchedule.wholeWeek.isClosed = true;

  return newSchedule;
};

export const addPhoneCounryCode = (phone: any) => {
  let resPhone = phone;

  if (!phone || phone === PHONE_COUNTRY_CODE) {
    resPhone = '';
  } else {
    resPhone = phone.startsWith(PHONE_COUNTRY_CODE) ? phone : `${PHONE_COUNTRY_CODE}${phone}`;
  }

  return resPhone;
};

export const deletePhoneCounryCode = (phone: any) => {
  let resPhone = phone;

  if (phone && phone.startsWith(PHONE_COUNTRY_CODE) && phone.length > PHONE_COUNTRY_CODE.length) {
    resPhone = phone.slice(2, phone.length);
  }

  return resPhone;
};

export const getDateFromTimezone = (date: string, user: User, format: string) => {
  const timezone = user.timezone ? user.timezone : 'UTC';
  return moment(date).format(format);
};

export const getDateWithFormat = (date: string, format: string) => {
  return moment(date)
    .tz('UTC')
    .format(format);
};

const prepareScheduleDay = (schedule: any, day: string) => {
  const newSchedule = Object.assign({}, schedule);

  if (schedule[day].open.hour === '' || schedule[day].close.hour === '') {
    newSchedule[day].open = '';
    newSchedule[day].close = '';
    return newSchedule;
  }
  const prevOpenHour = +schedule[day].open.hour;
  const prevCloseHour = +schedule[day].close.hour;

  const openHour =
    schedule[day].open.period === 'AM'
      ? prevOpenHour === 12
        ? 0
        : prevOpenHour
      : prevOpenHour === 12
      ? prevOpenHour
      : prevOpenHour + 12;

  const openMinutes = +schedule[day].open.minutes;
  newSchedule[day].open = moment()
    .utc()
    .hours(openHour)
    .minutes(openMinutes)
    .seconds(0)
    .toISOString();

  const closeHour =
    schedule[day].close.period === 'AM'
      ? prevCloseHour === 12
        ? 0
        : prevCloseHour
      : prevCloseHour === 12
      ? prevCloseHour
      : prevCloseHour + 12;

  const closeMinutes = +schedule[day].close.minutes;
  newSchedule[day].close = String(
    moment()
      .utc()
      .hours(closeHour)
      .minutes(closeMinutes)
      .seconds(0)
      .toISOString()
  );

  return newSchedule;
};

export const newScheduleForSendingToServer = (schedule: any) => {
  let newSchedule = Object.assign({}, schedule);

  // console.log(
  //   ' Object.keys(newSchedule).filter((d) => !!newSchedule[d].open.hour)',
  //   Object.keys(newSchedule).filter((d) => !!newSchedule[d].open.hour)
  // );

  if (Object.keys(newSchedule).some((d) => !!newSchedule[d].open.hour)) {
    let preparedSchedule = prepareScheduleDay(newSchedule, 'wholeWeek');
    days.forEach((day) => {
      // if (preparedSchedule[day.value].open) {
      //   preparedSchedule[day.value].open.minutes = newSchedule[day.value].open.minutes
      //     ? newSchedule[day.value].open.minutes
      //     : '00';
      // }
      // if (preparedSchedule[day.value].close) {
      //   preparedSchedule[day.value].close.minutes = newSchedule[day.value].close.minutes
      //     ? newSchedule[day.value].close.minutes
      //     : '00';
      // }
      preparedSchedule = prepareScheduleDay(preparedSchedule, day.value);
    });

    newSchedule = preparedSchedule;
  }

  return newSchedule;
};

const prepareScheduleUpdate = (schedule: any, day: string) => {
  const preparedSchedule = Object.assign({}, schedule);

  if (
    (typeof preparedSchedule[day].open === 'string' && preparedSchedule[day].open !== '') ||
    (typeof preparedSchedule[day].close === 'string' && preparedSchedule[day].close !== '')
  ) {
    const open = moment(preparedSchedule[day].open)
      .utc()
      .format('hh mm A')
      .split(' ');
    const [openHour, openMinutes, openPeriod] = open;
    preparedSchedule[day].open = { hour: openHour, minutes: openMinutes, period: openPeriod };
    const close = moment(preparedSchedule[day].close)
      .utc()
      .format('hh mm A')
      .split(' ');
    const [closeHour, closeMinutes, closePeriod] = close;
    preparedSchedule[day].close = { hour: closeHour, minutes: closeMinutes, period: closePeriod };
  } else if (!preparedSchedule[day].open) {
    if (preparedSchedule[day].open === null) {
      preparedSchedule[day].open = { hour: '', minutes: '', period: 'AM' };
      preparedSchedule[day].close = { hour: '', minutes: '', period: 'AM' };
    }
  }

  return preparedSchedule;
};

export const updateScheduleFromServerToRender = (schedule: any, typeOfUse: 'creating' | 'editing') => {
  let newSchedule = Object.assign({}, schedule);
  let open24h7d = false;

  if (Object.keys(newSchedule).some((d) => !!newSchedule[d].open)) {
    // or if (Object.keys(schedule).some((d) => typeof schedule[d].open === 'string'))
    let newUpdatedSchedule = Object.assign({}, newSchedule);

    const preparedAfterWholeWeek = prepareScheduleUpdate(newUpdatedSchedule, 'wholeWeek');
    days.map((day) => {
      const newScheduleData = prepareScheduleUpdate(preparedAfterWholeWeek, day.value);
      newUpdatedSchedule = newScheduleData;
    });
    const isOpen24H7d = checkIsOpen24h7d(newSchedule);

    if (typeOfUse === 'editing' && !newSchedule.wholeWeek.isClosed && isOpen24H7d) {
      newUpdatedSchedule = changeOpen24h7d(true, newSchedule);
      open24h7d = true;
    }

    if (typeOfUse === 'editing' && !newSchedule.wholeWeek.isClosed && !isOpen24H7d) {
      newUpdatedSchedule = setTimeFromOldLogic(newSchedule);
    }

    newSchedule = newUpdatedSchedule;
  } else {
    newSchedule = emptyPharmacy.schedule;
  }
  return { schedule: newSchedule, open24h7d };
};

export const isCourierComplete = (courier: CourierUser) => {
  return (
    courier.status !== 'INCOMPLETE' &&
    courier.teams &&
    courier.teams.length &&
    courier.completedHIPAATraining &&
    courier.dwolla &&
    courier.dwolla.bankAccountType
  );
};

export const isCourierUnregistered = (courier: CourierUser) => {
  return !(courier.hellosign && courier.hellosign.isAgreementSigned && courier.hellosign.isFW9Signed);
};

export const parseCourierRegistrationStatus = (
  courier: CourierUser
): {
  label: 'Unregistered' | 'Registered' | 'Pending';
  value: 'UNREGISTERED' | 'REGISTERED' | 'PENDING';
} => {
  let returnStatus: ReturnType<typeof parseCourierRegistrationStatus> = {
    label: 'Pending',
    value: 'PENDING'
  };

  if (courier.hellosign && courier.hellosign.isFW9Signed) {
    returnStatus = {
      label: 'Pending',
      value: 'PENDING'
    };
  }
  if (!(courier.hellosign && courier.hellosign.isFW9Signed)) {
    returnStatus = {
      label: 'Unregistered',
      value: 'UNREGISTERED'
    };
  }
  if (courier.dwolla && courier.dwolla.bankAccountType && courier.completedHIPAATraining && courier.teams.length) {
    returnStatus = {
      label: 'Registered',
      value: 'REGISTERED'
    };
  }
  return returnStatus;
};

export const parseOnboardingStatus = (
  courier: CourierUser
): {
  label: 'Incomplete' | 'Pending' | 'Approved' | 'Denied';
  value: 'INCOMPLETE' | 'PENDING' | 'APPROVED' | 'DENIED';
} => {
  let returnStatus: ReturnType<typeof parseOnboardingStatus> = {
    label: 'Incomplete',
    value: 'INCOMPLETE'
  };

  if (courier.status === 'ACTIVE') {
    returnStatus = {
      label: 'Approved',
      value: 'APPROVED'
    };
  }
  if (courier.status === 'DECLINED') {
    returnStatus = {
      label: 'Denied',
      value: 'DENIED'
    };
  }
  if (!['ACTIVE', 'DECLINED'].includes(courier.status) && courier.checkrInvLink) {
    returnStatus = {
      label: 'Pending',
      value: 'PENDING'
    };
  }
  if (!['ACTIVE', 'DECLINED'].includes(courier.status) && !courier.checkrInvLink) {
    returnStatus = {
      label: 'Incomplete',
      value: 'INCOMPLETE'
    };
  }
  return returnStatus;
};

export const getAddressString = (address: any, withApartment: boolean = true, slice?: number) => {
  if (typeof address === 'object') {
    if (!Object.keys(address).length) {
      return '-';
    }

    let addressString = `${address.number} ${address.street} ${address.city} ${address.state}`;

    if (address.zipCode || address.postalCode) {
      addressString += ` ${address.zipCode || address.postalCode}`;
    }

    if (withApartment && address.apartment) {
      addressString += `\n${address.apartment}`;
    }
    if (slice) {
      addressString = addressString.length > slice ? `${addressString.slice(0, slice)}...` : addressString;
    }
    return <span style={{ whiteSpace: 'pre-wrap' }}>{addressString}</span>;
  } else {
    return address || '-';
  }
};

export const isDevServer = () => {
  return window.location.host.includes('dev');
};

export const getYearToDate = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  // @ts-ignore
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round(diff / oneDay);
};

export const changeOpen24h7d = (isOpen24h7: boolean, schedule: any) => {
  const newSchedule = Object.assign({}, schedule);

  newSchedule.wholeWeek.isClosed = !isOpen24h7;

  if (isOpen24h7) {
    newSchedule.wholeWeek.close.hour = endOfTheWorkDay.hours;
    newSchedule.wholeWeek.close.minutes = endOfTheWorkDay.minutes;
    newSchedule.wholeWeek.close.period = endOfTheWorkDay.period;
    newSchedule.wholeWeek.open.hour = startOfTheWorkDay.hours;
    newSchedule.wholeWeek.open.minutes = startOfTheWorkDay.minutes;
    newSchedule.wholeWeek.open.period = startOfTheWorkDay.period;
  } else {
    newSchedule.wholeWeek.close.hour = '';
    newSchedule.wholeWeek.close.minutes = '';
    newSchedule.wholeWeek.close.period = 'AM';
    newSchedule.wholeWeek.open.hour = '';
    newSchedule.wholeWeek.open.minutes = '';
    newSchedule.wholeWeek.open.period = 'AM';
  }
  days.forEach((day) => {
    newSchedule[day.value].isClosed = isOpen24h7;
  });

  return newSchedule;
};

export const checkIsOpen24h7d = (schedule: any) => {
  if (
    schedule.wholeWeek.close.hour === endOfTheWorkDay.hours &&
    schedule.wholeWeek.close.minutes === endOfTheWorkDay.minutes &&
    schedule.wholeWeek.close.period === endOfTheWorkDay.period &&
    schedule.wholeWeek.open.hour === startOfTheWorkDay.hours &&
    schedule.wholeWeek.open.minutes === startOfTheWorkDay.minutes &&
    schedule.wholeWeek.open.period === startOfTheWorkDay.period &&
    days.every((day) => schedule[day.value].isClosed === true)
  ) {
    return true;
  }
  return false;
};

export const scheduleChecking = (schedule: any) =>
  Object.keys(schedule).every((day) => {
    // console.log('day ', day);
    // console.log('here --------------------------- 0');
    if (schedule[day].isClosed) return true;
    if (schedule[day].open.period) {
      // console.log('here --------------------------- 1');
      // console.log('schedule[day].open.hour ', schedule[day].open.hour);
      // console.log('schedule[day].close.hour ', schedule[day].close.hour);
      if (schedule[day].open.hour && schedule[day].close.hour) return true;
    } else {
      // console.log('here   --------------------------- 2');
      if (schedule[day].open && schedule[day].close) return true;
    }
    // console.log('here   --------------------------- 3');
    return false;
  });

export const getStringInvoicePeriod = (queue: any) => {
  return `${getDateInvoicePeriod(queue.deliveryStartDateAt)} - ${getDateInvoicePeriod(queue.deliveryEndDateAt)}`;
};

export const getDateInvoicePeriod = (date: string) => {
  if (!date) return '-';
  return moment(new Date(date))
    .utc()
    .format('MM/DD/YYYY');
};
