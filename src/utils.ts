import moment from 'moment';
import { ErrorInterface, DestructByKey } from './interfaces';
import { days } from './constants';
export const decodeErrors = (errors: ErrorInterface[]) => {
  return Array.from(errors || []).reduce((res: object, e: ErrorInterface) => {
    return { ...res, [e.field[0]]: e.messages[0] };
  }, {});
};

export const Statuses: DestructByKey<string> = {
  ACTIVE: 'Active',
  DECLINED: 'Declined',
  PENDING: 'Pending'
};

export const changeScheduleSplit = (isSplitByDay: boolean, schedule: any) => {
  if (isSplitByDay) {
    days.map((day) => {
      schedule[day.value].isClosed = false;
    });
    schedule.wholeWeek.isClosed = true;
  } else {
    days.map((day) => {
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
