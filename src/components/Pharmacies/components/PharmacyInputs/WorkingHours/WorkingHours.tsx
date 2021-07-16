import React, { FC, ReactNode, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import CheckBox from '../../../../common/Checkbox';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import usePharmacy from '../../../../../hooks/usePharmacy';
import { useStores } from '../../../../../store';
import { periodDays, mondayToFriday, weekends, endOfTheWorkDay, startOfTheWorkDay } from '../../../../../constants';
import TextField from '../../../../common/TextField';
import Select from '../../../../common/Select';
import Error from '../../../../common/Error';
import generalStyles from '../PharmacyInputs.module.sass';
import styles from './WorkingHours.module.sass';
import moment from 'moment';

interface IWorkingHours {
  err: any;
  setError: any;
  children?: ReactNode;
  handleChangeOpen24_7: any;
  isOpen24_7: boolean;
  fromSignUp?: boolean;
  editPharmacy?: any;
  dispatch?: any;
}

// end day 11:59 p.m
// start day 12:01 a.m

const WorkingHours: FC<IWorkingHours> = (props) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const { err, setError, handleChangeOpen24_7, isOpen24_7, fromSignUp = true, editPharmacy, dispatch } = props;
  const pharmacy = fromSignUp ? newPharmacy : editPharmacy;

  const validTime = (key: string = '', value: any) => {
    let isValid = true;

    if (!key) isValid = false;
    if (key === 'hour' && (value.length > 2 || value > 12)) isValid = false;
    if (key === 'minutes' && (value.length > 2 || value > 59)) isValid = false;

    return isValid;
  };

  // const clearDateOfDay = (schedule: any, day: string) => {
  //   schedule[day].close.hour = '';
  //   schedule[day].close.minutes = '';
  //   schedule[day].close.period = 'AM';
  //   schedule[day].open.hour = '';
  //   schedule[day].open.minutes = '';
  //   schedule[day].open.period = 'AM';
  // };

  // const fillInEmptyDay = (schedule: any, day: string) => {
  //   const filledDay = mondayToFriday.find(
  //     (day) =>
  //       (schedule[day.value].close && schedule[day.value].close.hour) ||
  //       (schedule[day.value].open && schedule[day.value].open.hour) ||
  //       (schedule[day.value].close && schedule[day.value].close.minutes) ||
  //       (schedule[day.value].open && schedule[day.value].open.minutes)
  //   );
  //   if (filledDay) {
  //     schedule[day].close.hour = schedule[filledDay.value].close.hour;
  //     schedule[day].close.minutes = schedule[filledDay.value].close.minutes;
  //     schedule[day].close.period = schedule[filledDay.value].close.period;
  //     schedule[day].open.hour = schedule[filledDay.value].open.hour;
  //     schedule[day].open.minutes = schedule[filledDay.value].open.minutes;
  //     schedule[day].open.period = schedule[filledDay.value].open.period;
  //   }
  // };

  const handleChangeSchedule = (day: string, param: string, key?: string) => (e: React.ChangeEvent<{ value: any }>) => {
    const { value } = e.target;

    // console.log('day', day);
    // console.log('param', param);
    // console.log('key', key);
    // console.log('value', value);

    const schedule = { ...pharmacy.schedule };
    setError({ ...err, schedule: '' });

    if (day === 'monday—friday' && validTime(key, value)) {
      mondayToFriday.forEach((day) => {
        schedule[day.value].isClosed = false;
        schedule[day.value][param][key as any] = value;
      });
    } else {
      if (param === 'isClosed') {
        const valueFromCheckbox = !schedule[day][param];
        // if (valueFromCheckbox) {
        //   clearDateOfDay(schedule, day);
        // } else {
        //   fillInEmptyDay(schedule, day);
        // }
        schedule[day][param] = valueFromCheckbox;
      } else {
        if (day && validTime(key, value)) {
          schedule[day][param][key as any] = value;
        } else return;
      }
    }

    if (fromSignUp) {
      pharmacyStore.set('newPharmacy')({
        ...pharmacy,
        schedule
      });
    }
    if (!fromSignUp) {
      dispatch({
        ...pharmacy,
        schedule
      });
    }
  };

  const isDaysFromMonToFriClosed = (schedule: any) => mondayToFriday.every((day: any) => schedule[day.value].isClosed);

  const renderDateInput = (day: string, param: string) => {
    let isString;
    let data;
    let inputValueHours;
    let inputValueMinutes;
    let inputValuePeriod;
    let disabledInputs = isOpen24_7 ? isOpen24_7 : _.get(pharmacy, `schedule[${day}].isClosed`);

    if (day === 'monday—friday') {
      isString = !_.get(pharmacy, `schedule.monday[${param}].period`);
      data = _.get(pharmacy, `schedule.monday[${param}]`);
      disabledInputs = isOpen24_7 ? isOpen24_7 : isDaysFromMonToFriClosed(pharmacy.schedule);
    } else {
      isString = !_.get(pharmacy, `schedule[${day}][${param}].period`);
      data = _.get(pharmacy, `schedule[${day}][${param}]`);
    }

    inputValueHours = isString ? (data ? moment(data).format('hh') : '') : data.hour;
    inputValueMinutes = isString ? (data ? moment(data).format('mm') : '') : data.minutes;
    inputValuePeriod = data ? data.period || moment(data).format('A') : 'AM';

    if (isOpen24_7 && param === 'open') {
      inputValueHours = startOfTheWorkDay.hours;
      inputValueMinutes = startOfTheWorkDay.minutes;
      inputValuePeriod = startOfTheWorkDay.period;
    }

    if (isOpen24_7 && param === 'close') {
      inputValueHours = endOfTheWorkDay.hours;
      inputValueMinutes = endOfTheWorkDay.minutes;
      inputValuePeriod = endOfTheWorkDay.period;
    }

    return (
      <div className={generalStyles.hourBlockInput}>
        <Typography className={generalStyles.label}>{param === 'open' ? 'Open' : 'Close'}</Typography>
        <div className={generalStyles.dateInput}>
          <TextField
            classes={{
              input: generalStyles.leftInput,
              inputRoot: classNames(generalStyles.inputRoot, generalStyles.textCenter)
            }}
            inputProps={{
              type: 'number',
              placeholder: '1-12'
            }}
            disabled={disabledInputs}
            value={inputValueHours}
            onChange={handleChangeSchedule(day, param, 'hour')}
          />
          <TextField
            classes={{
              input: generalStyles.middleInput,
              inputRoot: classNames(generalStyles.inputRoot, generalStyles.textCenter)
            }}
            inputProps={{
              type: 'number',
              placeholder: '00'
            }}
            disabled={disabledInputs}
            value={inputValueMinutes}
            onChange={handleChangeSchedule(day, param, 'minutes')}
          />
          <Select
            value={inputValuePeriod}
            onChange={handleChangeSchedule(day, param, 'period')}
            items={periodDays}
            inputProps={{
              disabled: disabledInputs
            }}
            IconComponent={() => <ArrowDropDown style={{ height: '14px', width: '15px' }} />}
            classes={{
              input: generalStyles.rightInput,
              selectLabel: generalStyles.selectLabel,
              inputRoot: generalStyles.inputRoot
            }}
            className={generalStyles.periodSelect}
          />
        </div>
      </div>
    );
  };

  const renderClosedAt = () => (
    <>
      <div className={styles.closedAt}> Closed at</div>
      <div>
        {mondayToFriday.map(({ label, value }) => (
          <Fragment key={label}>
            <CheckBox
              label={label.slice(0, 3)}
              labelPlacement="end"
              disabled={isOpen24_7}
              checked={isOpen24_7 ? !isOpen24_7 : pharmacy.schedule[value].isClosed}
              onChange={handleChangeSchedule(value, 'isClosed')}
              className={generalStyles.daysCheckbox}
            />
          </Fragment>
        ))}
      </div>
    </>
  );

  const renderWeekends = () => {
    return (
      <div>
        {weekends.map(({ label, value }) => (
          <div key={label}>
            <div className={styles.weekendLabel}>{label}</div>
            <div className={generalStyles.hoursBlockItem}>
              <div className={classNames(generalStyles.inputWrapper)}>
                {renderDateInput(value, 'open')}
                {renderDateInput(value, 'close')}
              </div>

              <CheckBox
                label={'Closed'}
                labelPlacement={'end'}
                disabled={isOpen24_7}
                checked={isOpen24_7 ? !isOpen24_7 : pharmacy.schedule[value].isClosed}
                onChange={handleChangeSchedule(value, 'isClosed')}
                className={generalStyles.daysCheckbox}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={generalStyles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={generalStyles.blockTitle}>Working Hours</Typography>
          <CheckBox
            label={'Open 24/7'}
            checked={isOpen24_7}
            onChange={handleChangeOpen24_7}
            className={generalStyles.daysCheckbox}
          />
        </div>

        <div className={generalStyles.hoursBlockItem}>
          <Typography className={generalStyles.dayTitle}>Monday — Friday</Typography>
          <div className={classNames(generalStyles.inputWrapper)}>
            {renderDateInput('monday—friday', 'open')}
            {renderDateInput('monday—friday', 'close')}
          </div>
        </div>
        {renderClosedAt()}
        {renderWeekends()}
        {err.schedule && <Error value={err.schedule} />}
      </div>
    </div>
  );
};

export default WorkingHours;
