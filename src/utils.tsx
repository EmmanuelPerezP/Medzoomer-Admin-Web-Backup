import React from 'react';
import moment from 'moment';
import { ErrorInterface, User } from './interfaces';
import { days } from './constants';

export const decodeErrors = (errors: ErrorInterface[]) => {
  return Array.from(errors || []).reduce((res: object, e: ErrorInterface) => {
    return { ...res, [e.field[0]]: e.messages[0] };
  }, {});
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

export const prepareScheduleDay = (schedule: any, day: string) => {
  const openHour = +schedule[day].open.hour + (schedule[day].open.period === 'PM' ? 12 : 0);
  const openMinutes = +schedule[day].open.minutes;
  const dateOpen = moment()
    .hours(openHour)
    .minutes(openMinutes)
    .toISOString();
  schedule[day].open = dateOpen;
  const closeHour = +schedule[day].close.hour + (schedule[day].close.period === 'PM' ? 12 : 0);
  const closeMinutes = +schedule[day].close.minutes;
  const dateClose = moment()
    .hours(closeHour)
    .minutes(closeMinutes)
    .toISOString();
  schedule[day].close = dateClose;
};

export const prepareScheduleUpdate = (schedule: any, day: string) => {
  const open = moment(schedule[day].open)
    .format('hh mm A')
    .split(' ');
  const [openHour, openMinutes, openPeriod] = open;
  schedule[day].open = { hour: openHour, minutes: openMinutes, period: openPeriod };

  const close = moment(schedule[day].close)
    .format('hh mm A')
    .split(' ');
  const [closeHour, closeMinutes, closePeriod] = close;
  schedule[day].close = { hour: closeHour, minutes: closeMinutes, period: closePeriod };
};

export const isCourierComplete = (courier: User) => {
  return (
    courier.status !== 'INCOMPLETE' &&
    courier.teams &&
    courier.teams.length &&
    courier.completedHIPAATraining &&
    courier.dwolla &&
    courier.dwolla.bankAccountType
  );
};

export const isCourierUnregistered = (courier: User) => {
  return !(courier.hellosign && courier.hellosign.isAgreementSigned && courier.hellosign.isFW9Signed);
};

export const parseCourierRegistrationStatus = (
  courier: User
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
  courier: User
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

export const getAddressString = (address: any, withApartment: boolean = true) => {
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

    return <span style={{ whiteSpace: 'pre-wrap' }}>{addressString}</span>;
  } else {
    return address || '-';
  }
};
