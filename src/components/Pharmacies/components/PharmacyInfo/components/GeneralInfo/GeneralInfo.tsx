import React, { FC, Fragment } from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { days } from '../../../../../../constants';
import styles from './styles.module.sass';
import { addPhoneCounryCode, checkIsOpen24h7d } from '../../../../../../utils';

interface IGeneralInfo {
  pharmacy: any;
}

const GeneralInfo: FC<IGeneralInfo> = ({ pharmacy }) => {
  const renderBasicInfo = () => (
    <div>
      {renderSummaryItem('Pharmacy Name', pharmacy.name)}
      {renderSummaryItem('Pharmacy Phone Number', addPhoneCounryCode(pharmacy.phone_number))}
      {renderSummaryItem(
        'Address',
        pharmacy.address && pharmacy.address.apartment
          ? pharmacy.roughAddress + ', ' + pharmacy.address.apartment
          : pharmacy.roughAddress
      )}
    </div>
  );

  const valueOfReferrals = () => {
    if (pharmacy.referrals.length > 0) {
      return pharmacy.referrals.map((referral: any, i: any) => {
        if (!referral.pharmacyName && !referral.managerName && !referral.contactInfo) {
          return '';
        } else {
          return (
            <div
              key={i}
              style={{
                marginBottom: 10
              }}
            >
              {`Referral #${i + 1} ${referral.pharmacyName || ''} ${referral.managerName ||
                ''} ${referral.contactInfo || ''}`}
            </div>
          );
        }
      });
    } else return '';
  };

  const valueOfManagers = (keyName: string) => {
    const key = keyName as 'primaryContact' | 'secondaryContact';
    return (
      <>
        {pharmacy.managers[key] && (
          <div>
            {(pharmacy.managers[key].firstName ? pharmacy.managers[key].firstName + ' ' : '') +
              (pharmacy.managers[key].lastName ? pharmacy.managers[key].lastName + ', ' : '') +
              (pharmacy.managers[key].phone ? addPhoneCounryCode(pharmacy.managers[key].phone) + ', ' : '') +
              (pharmacy.managers[key].email ? pharmacy.managers[key].email + ', ' : '')}
          </div>
        )}
      </>
    );
  };

  const timeValue = (schedule: any, day: string) => {
    let time = '';
    const open = schedule[day].open;
    const close = schedule[day].close;

    if (open && open.hour) {
      time = `${open.hour}:${open.minutes || '00'}
            ${open.period} -
            ${close.hour}:${close.minutes || '00'}
            ${close.period}`;
    } else {
      time = `${moment(open).format('LT')} -
              ${moment(close).format('LT')}`;
    }

    return time;
  };

  const renderWorkingHours = () => {
    const daysOffFromMondayToFriday: string[] = [];

    if (!pharmacy.schedule) return null;

    return (
      <div className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.title}>Working Hours</Typography>
        </div>

        {pharmacy.schedule.wholeWeek &&
          pharmacy.schedule.wholeWeek.isClosed &&
          days.map((day, i) => {
            const isFromMondayToFriday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.value);
            const time = timeValue(pharmacy.schedule, day.value);

            if (isFromMondayToFriday && pharmacy.schedule[day.value].isClosed) {
              daysOffFromMondayToFriday.push(day.label);
            }

            if (day.value === 'friday') {
              return (
                <Fragment key={i}>
                  {renderSummaryItem(
                    'Monday — Friday',
                    daysOffFromMondayToFriday.length > 0 && daysOffFromMondayToFriday.length !== 5
                      ? time + ' closed at: ' + daysOffFromMondayToFriday.join(', ')
                      : daysOffFromMondayToFriday.length === 5
                      ? 'closed'
                      : time
                  )}
                </Fragment>
              );
            } else if (!isFromMondayToFriday) {
              return (
                <Fragment key={i}>
                  {pharmacy.schedule[day.value].isClosed
                    ? renderSummaryItem(day.label, `Day Off`)
                    : renderSummaryItem(day.label, time)}
                </Fragment>
              );
            } else {
              return null;
            }
          })}

        {pharmacy.schedule &&
          !pharmacy.schedule.wholeWeek.isClosed &&
          checkIsOpen24h7d(pharmacy.schedule) &&
          renderSummaryItem('Monday — Friday, Saturday, Sunday', 'Open 24/7')}

        {pharmacy.schedule &&
          !pharmacy.schedule.wholeWeek.isClosed &&
          !checkIsOpen24h7d(pharmacy.schedule) &&
          renderSummaryItem('Monday — Friday, Saturday, Sunday', timeValue(pharmacy.schedule, 'wholeWeek'))}
      </div>
    );
  };

  const renderManagerProfile = () => (
    <div>
      <div className={styles.titleBlock}>
        <Typography className={styles.title}>Manager Profile</Typography>
      </div>

      {renderSummaryItem('Primary Contact', '', false, 'primaryContact')}
      {renderSummaryItem('Secondary Contact', '', false, 'secondaryContact')}
    </div>
  );

  const renderSummaryItem = (name: string, value: string, isReferrals: boolean = false, manager: string = '') => (
    <div className={styles.summaryItem}>
      <Typography className={styles.field}>{name}</Typography>
      {isReferrals && !manager && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {valueOfReferrals()}
        </div>
      )}
      {manager && !isReferrals && <div>{valueOfManagers(manager)}</div>}
      {!isReferrals && !manager && <Typography>{value}</Typography>}
      {!value && !manager && !isReferrals && (
        <Typography
          style={{
            color: '#798c9e'
          }}
        >
          Not provided
        </Typography>
      )}
    </div>
  );

  return (
    <div className={styles.createPharmacyWrapper}>
      <div className={styles.pharmacyBlock}>
        {renderBasicInfo()}
        {renderWorkingHours()}
        {renderManagerProfile()}
      </div>
    </div>
  );
};

export default GeneralInfo;
